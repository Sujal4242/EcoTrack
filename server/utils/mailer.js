const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

transporter.verify((err, success) => {
    if (err) {
        console.error("❌ Mailer error:", err.message);
        console.error("   Check EMAIL_USER and EMAIL_PASS in .env");
    } else {
        console.log("📧 Mailer ready — SMTP connected successfully");
    }
});

module.exports = transporter;