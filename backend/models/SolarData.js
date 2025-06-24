const mongoose = require('mongoose');

const solarDataSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model('solardatas', solarDataSchema);
