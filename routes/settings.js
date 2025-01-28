// backend/routes/settings.js
const express = require("express");
const router = express.Router();
const Settings = require("../models/Settings");

/**
 * GET /api/settings/address
 * Returns { coinAddress: string }
 */
router.get("/address", async (req, res) => {
  try {
    // We assume there's only 1 settings doc
    let settings = await Settings.findOne({});
    if (!settings) {
      // Create one if missing
      settings = await Settings.create({});
    }
    res.json({ coinAddress: settings.coinAddress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get coin address" });
  }
});

/**
 * PUT /api/settings/address
 * Body: { newAddress }
 * => update the placeholder
 */
router.put("/address", async (req, res) => {
  try {
    const { newAddress } = req.body;
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create({ coinAddress: newAddress });
    } else {
      settings.coinAddress = newAddress;
      await settings.save();
    }
    res.json({ success: true, coinAddress: newAddress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update coin address" });
  }
});

module.exports = router;
