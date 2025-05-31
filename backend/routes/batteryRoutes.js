const express = require('express');
const router = express.Router();
const BatteryData = require('../models/BatteryData');


router.get('/', async (req, res) => {
  try {
    const data = await BatteryData.find().sort({ timestamp: -1 }); 
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
