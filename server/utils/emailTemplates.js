const reminderTemplate = ({ email, daysSinceLastLog, lastLogDate, totalLogs, totalCO2 }) => ({
    subject: `⚠️ EcoTrack Reminder — You haven't logged e-waste in ${daysSinceLastLog} day${daysSinceLastLog > 1 ? "s" : ""}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>EcoTrack Reminder</title>
</head>
<body style="margin:0;padding:0;background:#0d1117;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d1117;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="background:#111827;border-radius:16px;overflow:hidden;border:1px solid #1f2937;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#064e3b,#111827);padding:36px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:26px;font-weight:800;color:#10b981;letter-spacing:-0.5px;">
                      ♻ EcoTrack
                    </span>
                    <br/>
                    <span style="font-size:12px;color:#6b7280;letter-spacing:2px;text-transform:uppercase;">
                      B2B E-Waste Manager
                    </span>
                  </td>
                  <td align="right">
                    <span style="background:#ef444420;border:1px solid #ef444440;color:#ef4444;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;">
                      Action Required
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Alert Banner -->
          <tr>
            <td style="background:#ef444410;border-top:1px solid #ef444430;border-bottom:1px solid #ef444430;padding:16px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:28px;">⚠️</span>
                  </td>
                  <td style="padding-left:12px;">
                    <p style="margin:0;color:#fca5a5;font-size:15px;font-weight:600;">
                      No e-waste logged in ${daysSinceLastLog} day${daysSinceLastLog > 1 ? "s" : ""}
                    </p>
                    <p style="margin:4px 0 0;color:#6b7280;font-size:13px;">
                      Last log: ${lastLogDate}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 8px;color:#9ca3af;font-size:14px;">Hello,</p>
              <p style="margin:0 0 24px;color:#d1d5db;font-size:15px;line-height:1.6;">
                Your EcoTrack workspace hasn't recorded any new e-waste disposal in
                <strong style="color:#f9fafb;">${daysSinceLastLog} day${daysSinceLastLog > 1 ? "s" : ""}</strong>.
                Regular logging ensures your organisation stays compliant with
                e-waste regulations and maintains an accurate disposal audit trail.
              </p>

              <!-- Stats Row -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td width="48%" style="background:#1f2937;border-radius:12px;padding:18px;text-align:center;border:1px solid #374151;">
                    <p style="margin:0;font-size:26px;font-weight:800;color:#10b981;">${totalLogs}</p>
                    <p style="margin:4px 0 0;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Total Logs</p>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" style="background:#1f2937;border-radius:12px;padding:18px;text-align:center;border:1px solid #374151;">
                    <p style="margin:0;font-size:26px;font-weight:800;color:#3b82f6;">${totalCO2} kg</p>
                    <p style="margin:4px 0 0;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">CO₂ Prevented</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="http://localhost:5173"
                      style="display:inline-block;background:#10b981;color:#ffffff;font-size:15px;font-weight:700;padding:14px 40px;border-radius:12px;text-decoration:none;letter-spacing:0.3px;">
                      ♻ Log E-Waste Now
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Why it matters -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="margin-top:28px;background:#0f2a1e;border:1px solid #064e3b;border-radius:12px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 12px;color:#10b981;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">
                      Why regular logging matters
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      ${[
            "Maintains a complete compliance audit trail",
            "Required under E-Waste Management Rules 2022",
            "Accurate CO₂ impact tracking for ESG reports",
            "Avoids penalties during government inspections",
        ].map((point) => `
                        <tr>
                          <td style="padding:4px 0;">
                            <span style="color:#10b981;margin-right:8px;">✓</span>
                            <span style="color:#9ca3af;font-size:13px;">${point}</span>
                          </td>
                        </tr>
                      `).join("")}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0d1117;padding:20px 40px;border-top:1px solid #1f2937;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;color:#374151;font-size:12px;">
                      © 2026 EcoTrack · B2B E-Waste Disposal Manager
                    </p>
                    <p style="margin:4px 0 0;color:#374151;font-size:11px;">
                      This reminder was sent to ${email}
                    </p>
                  </td>
                  <td align="right">
                    <span style="color:#10b981;font-size:18px;">♻</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `,
});

const monthlySummaryTemplate = ({ email, month, totalLogs, totalWeight, totalCO2, trees, topCategory }) => ({
    subject: `📊 EcoTrack Monthly Report — ${month}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#0d1117;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d1117;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="background:#111827;border-radius:16px;overflow:hidden;border:1px solid #1f2937;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#064e3b,#111827);padding:36px 40px;">
              <span style="font-size:26px;font-weight:800;color:#10b981;">♻ EcoTrack</span><br/>
              <span style="font-size:12px;color:#6b7280;letter-spacing:2px;text-transform:uppercase;">
                Monthly Summary · ${month}
              </span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 24px;color:#d1d5db;font-size:15px;line-height:1.6;">
                Here's your organisation's e-waste disposal summary for
                <strong style="color:#f9fafb;">${month}</strong>.
              </p>

              <!-- 4 stat boxes -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  ${[
            { label: "Total Logs", value: totalLogs, color: "#10b981" },
            { label: "Total Weight", value: `${totalWeight} kg`, color: "#3b82f6" },
            { label: "CO₂ Prevented", value: `${totalCO2} kg`, color: "#8b5cf6" },
            { label: "Trees Equiv.", value: `${trees} trees`, color: "#16a34a" },
        ].map((s) => `
                    <td width="23%" style="background:#1f2937;border-radius:10px;padding:14px;text-align:center;border:1px solid #374151;">
                      <p style="margin:0;font-size:20px;font-weight:800;color:${s.color};">${s.value}</p>
                      <p style="margin:4px 0 0;font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">${s.label}</p>
                    </td>
                    <td width="2%"></td>
                  `).join("")}
                </tr>
              </table>

              <p style="margin:0 0 16px;color:#9ca3af;font-size:13px;">
                Top category this month:
                <strong style="color:#10b981;">${topCategory || "—"}</strong>
              </p>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="http://localhost:5173"
                      style="display:inline-block;background:#10b981;color:#fff;font-size:15px;font-weight:700;padding:14px 40px;border-radius:12px;text-decoration:none;">
                      View Full Dashboard
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0d1117;padding:20px 40px;border-top:1px solid #1f2937;">
              <p style="margin:0;color:#374151;font-size:12px;">
                © 2026 EcoTrack · Sent to ${email}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `,
});

module.exports = { reminderTemplate, monthlySummaryTemplate };