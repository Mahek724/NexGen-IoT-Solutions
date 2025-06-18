const express = require('express');
const router = express.Router();

// Import 3 Mongoose models (one for each CSV)
const temperatureData = require('../models/TemperatureData');
const DailySampleData = require('../models/DailySampleData');
const MarchSampleData = require('../models/MarchSampleData');

router.get('/', async (req, res) => {
  try {
    const [temperature, dailySample, marchSample] = await Promise.all([
      temperatureData.find(), 
      DailySampleData.find(), 
      MarchSampleData.find()  
    ]);

    res.json({
      temperature,
      dailySample,
      marchSample
    });
  } catch (err) {
    console.error('❌ Error fetching solar data:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
