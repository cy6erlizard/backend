const express = require("express");
const axios = require("axios");
const router = express.Router();

// Fetch trending coins from CoinGecko API
router.get("/trending", async (req, res) => {
  try {
    const response = await axios.get(
      "https://pro-api.coingecko.com/api/v3/search/trending",
      {
        headers: { accept: "application/json" },
      }
    );
    const coins = response.data.coins.slice(0, 10).map((coin) => ({
      id: coin.item.id,
      name: coin.item.name,
      symbol: coin.item.symbol,
      marketCap: coin.item.data.market_cap || '',
      image: coin.item.large || "https://via.placeholder.com/50",
    }));
    console.log(coins);
    res.json(coins);
  } catch (error) {
    console.error("Error fetching trending coins:", error);
    res.status(500).json({ error: "Failed to fetch trending coins" });
  }
});

// Fetch meme coins from CoinGecko API
router.get("/search", async (req, res) => {
  const { query } = req.query;

  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/search?query=${query}`
    );
    const coins = response.data.coins.map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.current_price || '',
      marketCap: coin.market_cap || '',
      image: coin.large || "https://via.placeholder.com/50",
    }));
    res.json(coins);
  } catch (error) {
    console.error("Error fetching coins:", error);
    res.status(500).json({ error: "Failed to fetch coins" });
  }
});

module.exports = router;