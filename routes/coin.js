// backend/routes/coin.js
const express = require("express");
const axios = require("axios");
const router = express.Router();
const Coin = require("../models/Coin");

// GET /api/coins/trending
router.get("/trending", async (req, res) => {
  try {
    // Use free endpoint (not "pro-api")
    const response = await axios.get("https://api.coingecko.com/api/v3/search/trending");
    const coins = response.data.coins.map((item) => ({
      id: item.item.id,
      name: item.item.name,
      symbol: item.item.symbol,
      marketCap: item.item.market_cap || "",
      image: item.item.large || "https://via.placeholder.com/50",
    }));
    res.json(coins);
  } catch (error) {
    console.error("Error fetching trending coins:", error);
    res.status(500).json({ error: "Failed to fetch trending coins" });
  }
});

// GET /api/coins/search?query=...
router.get("/search", async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/search?query=${query}`);
    const coins = response.data.coins.map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.current_price || "",
      marketCap: coin.market_cap || "",
      image: coin.large || "https://via.placeholder.com/50",
    }));
    res.json(coins);
  } catch (error) {
    console.error("Error fetching coins:", error);
    res.status(500).json({ error: "Failed to fetch coins" });
  }
});

/**
 * PUT /api/coins/size
 * Body: { coinId, incrementSize }
 *
 * If coin doesn't exist, create it (baseSize=50).
 * If incrementSize>0, check IP => increment baseSize => broadcast.
 */
router.put("/size", async (req, res) => {
  try {
    const io = req.app.get("socketio");
    const { coinId, incrementSize } = req.body;
    const userIP = req.ip;

    let coin = await Coin.findOne({ coinId });
    if (!coin) {
      // Create new doc if not found
      coin = new Coin({ coinId, baseSize: 50 });
      await coin.save();
    }

    if (incrementSize > 0) {
      // Check if user has incremented before
      if (coin.incrementedIPs.includes(userIP)) {
        return res.status(403).json({ error: "You have already grown this coin once." });
      }
      coin.baseSize += incrementSize;
      coin.incrementedIPs.push(userIP);
      await coin.save();

      // Broadcast to all
      io.emit("coinSizeUpdated", { coinId, newSize: coin.baseSize });
    }

    res.json({ success: true, baseSize: coin.baseSize });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update coin size" });
  }
});

/**
 * GET /api/coins/sizes
 * => [ { coinId, baseSize }, ... ]
 */
router.get("/sizes", async (req, res) => {
  try {
    const coins = await Coin.find({});
    const data = coins.map((c) => ({
      coinId: c.coinId,
      baseSize: c.baseSize,
    }));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get coin sizes." });
  }
});

module.exports = router;
