// backend/models/Coin.js
const mongoose = require("mongoose");

const coinSchema = new mongoose.Schema({
  coinId: {
    type: String,
    required: true,
    unique: true,
  },
  // We'll only store bubble size
  baseSize: {
    type: Number,
    default: 50,
  },
  // We'll store IPs that have incremented this coin
  incrementedIPs: {
    type: [String],
    default: [],
  },
  // For a placeholder address (replace in DB when ready)
  coinAddress: {
    type: String,
    default: "0xPLACEHOLDER",
  },
});

module.exports = mongoose.model("Coin", coinSchema);
