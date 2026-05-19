const mongoose = require("mongoose");

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  note: { type: String, default: "" },
  changedAt: { type: Date, default: Date.now },
}, { _id: false });

const wasteLogSchema = new mongoose.Schema(
  {
    privyUserId: { type: String, required: true },
    userEmail: { type: String, default: "" },
    itemName: { type: String, required: true },
    category: { type: String, required: true },
    weight: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    condition: { type: String, enum: ["Working", "Damaged", "Dead"], default: "Dead" },
    disposedVia: { type: String, default: "" },
    serialNumber: { type: String, default: "" },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Logged", "Pickup Scheduled", "Picked Up", "Certificate Received", "Closed"],
      default: "Logged",
    },
    statusHistory: { type: [statusHistorySchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WasteLog", wasteLogSchema);