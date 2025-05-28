const express = require('express');
const router = express.Router();
const BatteryData = require('../models/BatteryData');

router.get('/', async (req, res) => {
  try {
    const data = await BatteryData.find().limit(300); // Adjust limit as needed
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
