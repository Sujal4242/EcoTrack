const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const WasteLog = require("../models/WasteLog");

router.post("/", async (req, res) => {
  try {
    const {
      privyUserId, userEmail,
      startDate, endDate,
      category, condition,
      itemName, disposedVia,
    } = req.body;

    if (!privyUserId) return res.status(400).json({ error: "privyUserId required" });

    // Build query
    const query = { privyUserId };
    if (category) query.category = category;
    if (condition) query.condition = condition;
    if (disposedVia) query.disposedVia = { $regex: disposedVia, $options: "i" };
    if (itemName) query.itemName = { $regex: itemName, $options: "i" };
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const logs = await WasteLog.find(query).sort({ createdAt: -1 });

    // PDF Setup
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="EcoTrack_Audit_Report_${Date.now()}.pdf"`
    );
    doc.pipe(res);

    // ── COLORS ──
    const GREEN = "#10b981";
    const DARK = "#111827";
    const GRAY = "#6b7280";
    const LGRAY = "#d1d5db";
    const WHITE = "#ffffff";
    const RED = "#ef4444";
    const AMBER = "#f59e0b";

    const pageW = doc.page.width;
    const margin = 50;
    const usable = pageW - margin * 2;

    // ── HEADER BANNER ──
    doc.rect(0, 0, pageW, 90).fill(DARK);
    doc.circle(pageW - 60, 45, 60).fill("#0f2a1e");
    doc.circle(pageW - 30, 10, 30).fill("#0f2a1e");

    doc.fontSize(22).font("Helvetica-Bold").fillColor(GREEN)
      .text("EcoTrack", margin, 28);
    doc.fontSize(10).font("Helvetica").fillColor(LGRAY)
      .text("B2B E-Waste Disposal Manager", margin, 54);

    doc.fontSize(9).fillColor(GRAY)
      .text(`Generated: ${new Date().toLocaleString("en-IN")}`, 0, 28, { align: "right", width: pageW - margin })
      .text(`Prepared for: ${userEmail || privyUserId}`, 0, 44, { align: "right", width: pageW - margin });

    doc.moveDown(4);

    // ── TITLE ──
    doc.fontSize(18).font("Helvetica-Bold").fillColor(DARK)
      .text("Compliance Audit Report", margin, 110);
    doc.moveDown(0.3);
    doc.rect(margin, doc.y, usable, 2).fill(GREEN);
    doc.moveDown(0.8);

    // ── FILTER SUMMARY BOX ──
    const boxY = doc.y;
    doc.rect(margin, boxY, usable, 110).fill("#f9fafb").stroke("#e5e7eb");

    doc.fontSize(10).font("Helvetica-Bold").fillColor(DARK)
      .text("Applied Filters", margin + 16, boxY + 12);

    const filters = [
      ["Date Range", startDate || endDate
        ? `${startDate ? new Date(startDate).toDateString() : "Any"} → ${endDate ? new Date(endDate).toDateString() : "Any"}`
        : "All Dates"],
      ["Category", category || "All Categories"],
      ["Condition", condition || "All Conditions"],
      ["Item Name", itemName || "All Items"],
      ["Disposed Via", disposedVia || "All Vendors"],
    ];

    const col1X = margin + 16;
    const col2X = margin + 140;
    let fy = boxY + 30;
    filters.forEach(([label, value]) => {
      doc.fontSize(8.5).font("Helvetica-Bold").fillColor(GRAY).text(label, col1X, fy);
      doc.fontSize(8.5).font("Helvetica").fillColor(DARK).text(value, col2X, fy);
      fy += 15;
    });

    doc.y = boxY + 120;

    // ── SUMMARY STATS ──
    const totalWeight = logs.reduce((s, l) => s + l.weight, 0);
    const totalQty = logs.reduce((s, l) => s + (l.quantity || 1), 0);

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

    const totalCO2 = parseFloat(
      logs.reduce((s, l) => s + l.weight * (CO2_FACTORS[l.category] ?? 16), 0).toFixed(1)
    );
    const trees = Math.floor(totalCO2 / 21);

    const statBoxes = [
      { label: "Total Records", value: logs.length.toString(), color: "#10b981" },
      { label: "Total Weight", value: `${totalWeight.toFixed(1)} kg`, color: "#3b82f6" },
      { label: "CO2 Prevented", value: `${totalCO2} kg`, color: "#059669" },
      { label: "Trees Equiv.", value: `${trees} trees`, color: "#16a34a" },
    ];

    const boxW = (usable - 30) / 4;
    const sbY = doc.y + 8;
    statBoxes.forEach((box, i) => {
      const bx = margin + i * (boxW + 10);
      doc.rect(bx, sbY, boxW, 54).fill(box.color);
      doc.fontSize(20).font("Helvetica-Bold").fillColor(WHITE)
        .text(box.value, bx, sbY + 8, { width: boxW, align: "center" });
      doc.fontSize(8).font("Helvetica").fillColor(WHITE)
        .text(box.label, bx, sbY + 34, { width: boxW, align: "center" });
    });

    doc.y = sbY + 68;
    doc.moveDown(0.5);

    // ── TABLE ──
    if (logs.length === 0) {
      doc.fontSize(12).font("Helvetica").fillColor(GRAY)
        .text("No records found matching the selected filters.", { align: "center" });
    } else {
      // Column definitions
      const cols = [
        { label: "#", key: "index", w: 24 },
        { label: "Item Name", key: "itemName", w: 110 },
        { label: "Category", key: "category", w: 110 },
        { label: "Condition", key: "condition", w: 58 },
        { label: "Qty", key: "quantity", w: 24 },
        { label: "Weight", key: "weight", w: 40 },
        { label: "Vendor", key: "disposedVia", w: 80 },
        { label: "Date", key: "createdAt", w: 70 },
      ];

      const rowH = 22;
      const headerH = 26;

      const drawTableHeader = (y) => {
        doc.rect(margin, y, usable, headerH).fill(DARK);
        let cx = margin + 8;
        cols.forEach((col) => {
          doc.fontSize(8).font("Helvetica-Bold").fillColor(WHITE)
            .text(col.label, cx, y + 8, { width: col.w, ellipsis: true });
          cx += col.w;
        });
        return y + headerH;
      };

      const COND_COLOR = { Working: GREEN, Damaged: AMBER, Dead: RED };

      let tableY = doc.y;
      let rowY = drawTableHeader(tableY);

      logs.forEach((log, idx) => {
        // Page break
        if (rowY + rowH > doc.page.height - 80) {
          doc.addPage();
          rowY = drawTableHeader(50);
        }

        const bg = idx % 2 === 0 ? WHITE : "#f3f4f6";
        doc.rect(margin, rowY, usable, rowH).fill(bg);

        // light row border
        doc.rect(margin, rowY, usable, rowH).stroke("#e5e7eb");

        const rowData = [
          (idx + 1).toString(),
          log.itemName,
          log.category,
          log.condition || "—",
          (log.quantity || 1).toString(),
          `${log.weight} kg`,
          log.disposedVia || "—",
          new Date(log.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
          }),
        ];

        let cx = margin + 8;
        cols.forEach((col, ci) => {
          const val = rowData[ci];
          // Condition gets a colored dot
          if (col.key === "condition") {
            const dotColor = COND_COLOR[val] || GRAY;
            doc.circle(cx + 5, rowY + rowH / 2, 4).fill(dotColor);
            doc.fontSize(8).font("Helvetica").fillColor(DARK)
              .text(val, cx + 12, rowY + 7, { width: col.w - 12, ellipsis: true });
          } else {
            doc.fontSize(8).font("Helvetica").fillColor(DARK)
              .text(val, cx, rowY + 7, { width: col.w, ellipsis: true });
          }
          cx += col.w;
        });

        rowY += rowH;
      });

      // Table bottom border
      doc.rect(margin, rowY, usable, 1).fill(DARK);
    }

    // ── FOOTER on every page ──
    const totalPages = doc.bufferedPageRange
      ? doc.bufferedPageRange().count
      : 1;

    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(range.start + i);
      const footerY = doc.page.height - 44;
      doc.rect(0, footerY, pageW, 44).fill(DARK);
      doc.fontSize(8).font("Helvetica").fillColor(GRAY)
        .text(
          "This report is auto-generated by EcoTrack. For compliance use only. — © EcoTrack 2026",
          margin, footerY + 14,
          { align: "center", width: usable }
        );
    }

    doc.end();
  } catch (err) {
    console.error("PDF Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;