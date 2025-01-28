// backend/models/Settings.js
const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  coinAddress: { type: String, default: "0xPLACEHOLDER" },
});

module.exports = mongoose.model("Settings", settingsSchema);
