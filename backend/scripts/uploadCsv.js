const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const csv = require('csvtojson');

const BatteryData = require('../models/BatteryData');
const SolarData = require('../models/SolarData');

async function importCSV(filePath, Model, transformFn = null, useInsertMany = false) {
  const absolutePath = path.join(__dirname, filePath);
  const jsonArray = await csv().fromFile(absolutePath);
  console.log(`📥 Parsed ${jsonArray.length} rows from ${filePath}`);
  console.log('🔍 First Row:', jsonArray[0]);

  const formatted = transformFn
    ? jsonArray.map(transformFn).filter(e => e) // remove null/undefined
    : jsonArray;

  if (useInsertMany) {
    await Model.insertMany(formatted);
    console.log(`✅ Inserted ${formatted.length} documents into ${Model.collection.name}`);
  } else {
    for (const row of formatted) {
      if (!row) continue;
      await Model.updateOne(
        {
          towerId: row.towerId,
          timestamp: row.timestamp
        },
        { $set: row },
        { upsert: true }
      );
    }
    console.log(`✅ Synced data from ${filePath}`);
  }
}

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');

    // 🚨 Use insertMany for first-time import (no duplicates)
    await importCSV('../data/battery_data.csv', BatteryData, (item) => ({
      towerId: parseInt(item['TowerId'], 10),
      timestamp: new Date(item['Timestamp']),
      temperature: parseFloat(item['Temperature']),
      humidity: parseFloat(item['Humidity']),
      pressure: parseFloat(item['Pressure']),
      gas_resistance: parseFloat(item['GasResistance']),
      altitude: parseFloat(item['Altitude']),
      voltage: parseFloat(item['Voltage']),
    }), false); // <-- true enables insertMany

    // ⚙️ You can still use updateOne for solar_data
    await importCSV('../data/solar_data.csv', SolarData);

    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Error:', err);
    mongoose.disconnect();
  });
