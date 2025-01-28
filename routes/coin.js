// backend/routes/coin.js
const express = require("express");
const axios = require("axios");
const router = express.Router();
const Coin = require("../models/Coin");

// GET /api/coins/trending
router.get("/trending", async (req, res) => {
  try {
    // Use the *free* Coingecko endpoint (NOT pro-api)
    const response = await axios.get("https://api.coingecko.com/api/v3/search/trending");
    const coins = response.data.coins.slice(0, 10).map((coin) => ({
      id: coin.item.id,
      name: coin.item.name,
      symbol: coin.item.symbol,
      marketCap: coin.item.market_cap || "",
      image: coin.item.large || "https://via.placeholder.com/50",
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
 * - If coin doesn't exist, create it (baseSize=50).
 * - If incrementSize > 0, check the user IP is not repeated. If OK, increment baseSize.
 * - Return { success: true, baseSize }
 */
router.put("/size", async (req, res) => {
  try {
    const io = req.app.get("socketio"); // from server.js
    const { coinId, incrementSize } = req.body;
    const userIP = req.ip;

    let coin = await Coin.findOne({ coinId });
    if (!coin) {
      coin = new Coin({
        coinId,
        baseSize: 50,
      });
      await coin.save();
    }

    // If user wants to increment
    if (incrementSize > 0) {
      // Check if user IP is already in incrementedIPs
      if (coin.incrementedIPs.includes(userIP)) {
        return res.status(403).json({ error: "You have already grown this coin once." });
      }
      // Otherwise increment
      coin.baseSize += incrementSize;
      coin.incrementedIPs.push(userIP);
      await coin.save();

      // Broadcast update
      io.emit("coinSizeUpdated", {
        coinId,
        newSize: coin.baseSize,
      });
    }

    return res.json({ success: true, baseSize: coin.baseSize });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update coin size." });
  }
});

/**
 * GET /api/coins/sizes
 * Returns an array of { coinId, baseSize }
 */
router.get("/sizes", async (req, res) => {
  try {
    const coins = await Coin.find({});
    const result = coins.map((c) => ({
      coinId: c.coinId,
      baseSize: c.baseSize,
    }));
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve coin sizes." });
  }
});

module.exports = router;
