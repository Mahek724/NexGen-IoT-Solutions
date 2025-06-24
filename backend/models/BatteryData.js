const mongoose = require('mongoose');

const batteryDataSchema = new mongoose.Schema({
  towerId: Number,
  timestamp: { type: Date, required: true },
  temperature: Number,
  humidity: Number,
  pressure: Number,
  gas_resistance: Number,
  altitude: Number,
  voltage: Number
}, { collection: 'battery_data' });

module.exports = mongoose.model('BatteryData', batteryDataSchema);
