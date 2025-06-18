const mongoose = require('mongoose');

const marchSampleSchema = new mongoose.Schema({
  Time: Date,
  EacToday: Number,
  EacTotal: Number,
  Ppv: Number,
  EpvToday: Number,
  EpvTotal: Number,
  TimeTotal: Number,
  IacR: Number,
  IacS: Number,
  IacT: Number,
  PacR: Number,
  PacS: Number,
  PacT: Number,
  VacR: Number,
  VacS: Number,
  VacT: Number,
  Pac: Number,
  INVTemp: Number,
  AMTemp1: Number,
  BTTemp: Number,
  OUTTemp: Number,
  AMTemp2: Number,
  ReactPower: Number,
  ReactPowerMax: Number,
  ReactPower_Total: Number,
  Date: Date
}, { collection: 'march_sample' });

module.exports = mongoose.model('MarchSample', marchSampleSchema);
