// backend/models/Coin.js
const mongoose = require("mongoose");

const coinSchema = new mongoose.Schema({
  // The unique ID from CoinGecko
  coinId: { type: String, required: true, unique: true },

  // Only store the "raw" bubble size
  baseSize: { type: Number, default: 50 },

  // Keep track of which IPs have incremented the size
  incrementedIPs: { type: [String], default: [] },

  // (Optional) placeholder for a coin address, if each coin had one
  // but here it's independent, so you can omit if not needed
});

module.exports = mongoose.model("Coin", coinSchema);
