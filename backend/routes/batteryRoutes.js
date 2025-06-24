const express = require('express');
const router = express.Router();
const BatteryData = require('../models/BatteryData');

router.get('/', async (req, res) => {
  try {
    const { towerId } = req.query;
    const filter = towerId ? { towerId: Number(towerId) } : {};
    const data = await BatteryData.find(filter).sort({ timestamp: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;