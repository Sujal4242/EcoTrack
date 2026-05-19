const express = require("express");
const router = express.Router();
const WasteLog = require("../models/WasteLog");
const transporter = require("../utils/mailer");
const { reminderTemplate, monthlySummaryTemplate } = require("../utils/emailTemplates");

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

// POST — save user email against their privyUserId
router.post("/register", async (req, res) => {
    try {
        const { privyUserId, email } = req.body;
        if (!privyUserId || !email)
            return res.status(400).json({ error: "privyUserId and email required" });

        // Update all logs for this user with their email
        await WasteLog.updateMany({ privyUserId }, { $set: { userEmail: email } });
        res.json({ message: "Email registered" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST — send test reminder immediately
router.post("/test-reminder", async (req, res) => {
    try {
        const { privyUserId, email } = req.body;
        if (!privyUserId || !email)
            return res.status(400).json({ error: "privyUserId and email required" });

        const logs = await WasteLog.find({ privyUserId });
        if (!logs.length)
            return res.status(400).json({ error: "No logs found for this user" });

        const lastLog = logs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        const diffMs = new Date() - new Date(lastLog.createdAt);
        const daysSince = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
        const totalCO2 = parseFloat(
            logs.reduce((s, l) => s + l.weight * (CO2_FACTORS[l.category] ?? 16), 0).toFixed(1)
        );

        const { subject, html } = reminderTemplate({
            email,
            daysSinceLastLog: daysSince,
            lastLogDate: new Date(lastLog.createdAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "long", year: "numeric",
            }),
            totalLogs: logs.length,
            totalCO2,
        });

        await transporter.sendMail({
            from: `"EcoTrack" <${process.env.EMAIL_USER}>`,
            to: email,
            subject,
            html,
        });

        res.json({ message: `Reminder sent to ${email}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST — send test monthly summary immediately
router.post("/test-monthly", async (req, res) => {
    try {
        const { privyUserId, email } = req.body;
        if (!privyUserId || !email)
            return res.status(400).json({ error: "privyUserId and email required" });

        const logs = await WasteLog.find({ privyUserId });
        if (!logs.length)
            return res.status(400).json({ error: "No logs found" });

        const totalCO2 = parseFloat(
            logs.reduce((s, l) => s + l.weight * (CO2_FACTORS[l.category] ?? 16), 0).toFixed(1)
        );
        const totalWeight = parseFloat(
            logs.reduce((s, l) => s + l.weight, 0).toFixed(1)
        );
        const trees = Math.floor(totalCO2 / 21);
        const catCount = logs.reduce((acc, l) => {
            acc[l.category] = (acc[l.category] || 0) + 1; return acc;
        }, {});
        const topCategory = Object.entries(catCount)
            .sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

        const month = new Date().toLocaleDateString("en-IN", {
            month: "long", year: "numeric",
        });

        const { subject, html } = monthlySummaryTemplate({
            email, month,
            totalLogs: logs.length,
            totalWeight, totalCO2, trees, topCategory,
        });

        await transporter.sendMail({
            from: `"EcoTrack" <${process.env.EMAIL_USER}>`,
            to: email,
            subject,
            html,
        });

        res.json({ message: `Monthly summary sent to ${email}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;