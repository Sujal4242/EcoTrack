const express = require("express");
const router = express.Router();
const WasteLog = require("../models/WasteLog");

// GET — fetch logs with optional filters
router.get("/", async (req, res) => {
  try {
    const { privyUserId, category, search, startDate, endDate } = req.query;
    if (!privyUserId) return res.status(400).json({ error: "privyUserId required" });

    const query = { privyUserId };
    if (category) query.category = category;
    if (search) query.itemName = { $regex: search, $options: "i" };
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const logs = await WasteLog.find(query).sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET — stats by category
router.get("/stats", async (req, res) => {
  try {
    const { privyUserId } = req.query;
    if (!privyUserId) return res.status(400).json({ error: "privyUserId required" });

    const stats = await WasteLog.aggregate([
      { $match: { privyUserId } },
      {
        $group: {
          _id: "$category",
          totalWeight: { $sum: "$weight" },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalWeight: -1 } },
    ]);

    const totalWeight = stats.reduce((s, c) => s + c.totalWeight, 0);
    const totalItems = stats.reduce((s, c) => s + c.count, 0);
    res.json({ byCategory: stats, totalWeight, totalItems });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST — create log
router.post("/", async (req, res) => {
  try {
    const { privyUserId, itemName, category, weight, quantity, condition, disposedVia, serialNumber, notes } = req.body;
    if (!privyUserId || !itemName || !category || !weight) {
      return res.status(400).json({ error: "Required fields missing" });
    }
    const log = await WasteLog.create({
      privyUserId, itemName, category, weight,
      quantity, condition, disposedVia, serialNumber, notes,
    });
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT — update a log
router.put("/:id", async (req, res) => {
  try {
    const { itemName, category, weight, quantity, condition, disposedVia, serialNumber, notes } = req.body;
    const log = await WasteLog.findByIdAndUpdate(
      req.params.id,
      { itemName, category, weight, quantity, condition, disposedVia, serialNumber, notes },
      { new: true }
    );
    res.json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE — single
router.delete("/:id", async (req, res) => {
  try {
    await WasteLog.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE — bulk
router.delete("/bulk/many", async (req, res) => {
  try {
    const { ids } = req.body;
    await WasteLog.deleteMany({ _id: { $in: ids } });
    res.json({ message: `${ids.length} logs deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET — export as CSV
router.get("/export/csv", async (req, res) => {
  try {
    const {
      privyUserId, category, condition,
      itemName, disposedVia, startDate, endDate,
    } = req.query;

    if (!privyUserId) return res.status(400).json({ error: "privyUserId required" });

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

    // Build CSV
    const escape = (val) => {
      const str = val == null ? "" : String(val);
      return str.includes(",") || str.includes('"') || str.includes("\n")
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    };

    const headers = [
      "S.No", "Item Name", "Serial Number", "Category",
      "Condition", "Quantity", "Weight (kg)",
      "Disposed Via", "Notes", "Date Logged",
    ];

    const rows = logs.map((log, i) => [
      i + 1,
      log.itemName,
      log.serialNumber || "",
      log.category,
      log.condition || "",
      log.quantity || 1,
      log.weight,
      log.disposedVia || "",
      log.notes || "",
      new Date(log.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
      }),
    ]);

    const csvContent = [
      // Title rows
      ["EcoTrack — E-Waste Disposal Log"],
      [`Exported on: ${new Date().toLocaleString("en-IN")}`],
      [`Total Records: ${logs.length}`],
      [], // blank line
      headers,
      ...rows,
    ]
      .map((row) => row.map(escape).join(","))
      .join("\r\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="EcoTrack_Export_${Date.now()}.csv"`
    );
    res.send(csvContent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH — update status of a log
router.patch("/:id/status", async (req, res) => {
  try {
    const { status, note } = req.body;

    const VALID = [
      "Logged",
      "Pickup Scheduled",
      "Picked Up",
      "Certificate Received",
      "Closed",
    ];

    if (!VALID.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const log = await WasteLog.findByIdAndUpdate(
      req.params.id,
      {
        status,
        $push: {
          statusHistory: {
            status,
            note: note || "",
            changedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!log) return res.status(404).json({ error: "Log not found" });
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET — single public log by ID (for QR scan page)
router.get("/public/:id", async (req, res) => {
  try {
    const log = await WasteLog.findById(req.params.id).select(
      "itemName category condition weight quantity disposedVia serialNumber notes status statusHistory createdAt"
    );
    if (!log) return res.status(404).json({ error: "Log not found" });
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;