const mongoose = require('mongoose');

const dailySampleSchema = new mongoose.Schema({
  Time: Date,
  EacToday: Number,
  INVTemp: Number,
  AMTemp1: Number,
  BTTemp: Number,
  OUTTemp: Number,
  AMTemp2: Number,
  next_after: Number
}, { collection: 'daily_sample' });

module.exports = mongoose.model('DailySample', dailySampleSchema, 'daily_sample');
