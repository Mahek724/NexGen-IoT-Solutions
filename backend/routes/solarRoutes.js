const express = require('express');
const router = express.Router();
const SolarData = require('../models/SolarData');

router.get('/', async (req, res) => {
  try {
    const data = await SolarData.find().sort({ Time: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
