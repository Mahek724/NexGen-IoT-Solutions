const mongoose = require('mongoose');

const temperatureSchema = new mongoose.Schema({
  AMTemp1: Number,
  EacToday: Number
}, { collection: 'temprature_data' });

module.exports = mongoose.model('temperatureData', temperatureSchema, 'temprature_data');

