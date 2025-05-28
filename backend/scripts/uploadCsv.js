const path = require('path');   
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const csv = require('csvtojson');
const BatteryData = require('../models/BatteryData');

const csvFilePath = path.join(__dirname, '../data/battery_data.csv');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    return csv().fromFile(csvFilePath);
  })
  .then(async (jsonArray) => {
    console.log('CSV Rows Parsed:', jsonArray.length); 

    const formatted = jsonArray.map(item => {
      const timestamp = new Date(item['Timestamp']);
      const gasResistance = parseFloat(item['GasResistance']);
      const voltage = parseFloat(item['Voltage']); 

      return {
        timestamp: isNaN(timestamp) ? null : timestamp,
        temperature: parseFloat(item['Temperature']),  // ✅ matches header
        humidity: parseFloat(item['Humidity']),
        pressure: parseFloat(item['Pressure']),
        gas_resistance: isNaN(gasResistance) ? null : gasResistance,
        altitude: parseFloat(item['Altitude']),
        voltage: isNaN(voltage) ? null : voltage,
      };
    }).filter(entry =>
      entry.timestamp !== null &&
      entry.gas_resistance !== null &&
      entry.voltage !== null
    );

    await BatteryData.insertMany(formatted);
    console.log('✅ CSV data imported successfully!');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Error:', err);
    mongoose.disconnect();
  });
