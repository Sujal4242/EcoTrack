const cron = require("node-cron");
const WasteLog = require("../models/WasteLog");
const transporter = require("./mailer");
const { reminderTemplate, monthlySummaryTemplate } = require("./emailTemplates");

const CO2_FACTORS = {
    "Computers & Laptops": 20,
    "Mobile Phones": 70,
    "Televisions": 15,
    "Printers & Peripherals": 18,
    "Batteries": 12,
    "Medical Equipment": 22,
    "Networking Devices": 25,
    "Other Electronics": 16,
};

// ── DAILY REMINDER — runs every day at 9:00 AM ──
// To test immediately change "0 9 * * *" to "* * * * *" (every minute)
cron.schedule("0 9 * * *", async () => {
    console.log("⏰ Running daily reminder check...");
    try {
        // Get all unique users who have logs
        const users = await WasteLog.aggregate([
            {
                $group: {
                    _id: "$privyUserId",
                    lastLogDate: { $max: "$createdAt" },
                    totalLogs: { $sum: 1 },
                    userEmail: { $first: "$userEmail" },
                    logs: { $push: { weight: "$weight", category: "$category" } },
                },
            },
        ]);

        for (const user of users) {
            const now = new Date();
            const lastLog = new Date(user.lastLogDate);
            const diffMs = now - lastLog;
            const daysSince = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            // Send reminder if no log in 1+ days
            if (daysSince >= 1 && user.userEmail) {
                const totalCO2 = parseFloat(
                    user.logs
                        .reduce((s, l) => s + l.weight * (CO2_FACTORS[l.category] ?? 16), 0)
                        .toFixed(1)
                );

                const { subject, html } = reminderTemplate({
                    email: user.userEmail,
                    daysSinceLastLog: daysSince,
                    lastLogDate: lastLog.toLocaleDateString("en-IN", {
                        day: "numeric", month: "long", year: "numeric",
                    }),
                    totalLogs: user.totalLogs,
                    totalCO2,
                });

                await transporter.sendMail({
                    from: `"EcoTrack" <${process.env.EMAIL_USER}>`,
                    to: user.userEmail,
                    subject,
                    html,
                });

                console.log(`📧 Reminder sent to ${user.userEmail} (${daysSince} days since last log)`);
            }
        }
    } catch (err) {
        console.error("❌ Reminder cron error:", err.message);
    }
});

// ── MONTHLY SUMMARY — runs 1st of every month at 8:00 AM ──
cron.schedule("0 8 1 * *", async () => {
    console.log("📊 Running monthly summary...");
    try {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        const monthName = monthStart.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

        const users = await WasteLog.aggregate([
            { $match: { createdAt: { $gte: monthStart, $lte: monthEnd } } },
            {
                $group: {
                    _id: "$privyUserId",
                    userEmail: { $first: "$userEmail" },
                    totalLogs: { $sum: 1 },
                    totalWeight: { $sum: "$weight" },
                    categories: { $push: "$category" },
                    logs: { $push: { weight: "$weight", category: "$category" } },
                },
            },
        ]);

        for (const user of users) {
            if (!user.userEmail) continue;

            const totalCO2 = parseFloat(
                user.logs
                    .reduce((s, l) => s + l.weight * (CO2_FACTORS[l.category] ?? 16), 0)
                    .toFixed(1)
            );
            const trees = Math.floor(totalCO2 / 21);

            // Find top category
            const catCount = user.categories.reduce((acc, c) => {
                acc[c] = (acc[c] || 0) + 1; return acc;
            }, {});
            const topCategory = Object.entries(catCount)
                .sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

            const { subject, html } = monthlySummaryTemplate({
                email: user.userEmail,
                month: monthName,
                totalLogs: user.totalLogs,
                totalWeight: parseFloat(user.totalWeight.toFixed(1)),
                totalCO2,
                trees,
                topCategory,
            });

            await transporter.sendMail({
                from: `"EcoTrack" <${process.env.EMAIL_USER}>`,
                to: user.userEmail,
                subject,
                html,
            });

            console.log(`📊 Monthly summary sent to ${user.userEmail}`);
        }
    } catch (err) {
        console.error("❌ Monthly cron error:", err.message);
    }
});

console.log("✅ Schedulers registered: daily reminder + monthly summary");