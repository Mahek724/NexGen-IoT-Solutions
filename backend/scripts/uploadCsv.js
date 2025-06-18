const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const csv = require('csvtojson');

const BatteryData = require('../models/BatteryData');
const TemperatureData = require('../models/TemperatureData');
const DailySample = require('../models/DailySampleData');
const MarchSample = require('../models/MarchSampleData');

async function importCSV(filePath, Model, transformFn = null) {
  const absolutePath = path.join(__dirname, filePath);
  const jsonArray = await csv().fromFile(absolutePath);
  console.log(`📥 Parsed ${jsonArray.length} rows from ${filePath}`);
  console.log('🔍 First Row:', jsonArray[0]);

  const formatted = transformFn
    ? jsonArray.map(transformFn).filter(e => e)
    : jsonArray;

  await Model.insertMany(formatted);
  console.log(`✅ Imported data from ${filePath}`);
}

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');

    // 1. battery_data.csv
    await importCSV('../data/battery_data.csv', BatteryData, (item) => {
      const timestamp = new Date(item['Timestamp']);
      const gasResistance = parseFloat(item['GasResistance']);
      const voltage = parseFloat(item['Voltage']);
      const temperature = parseFloat(item['Temperature']);
      const towerId = parseInt(item['TowerId'], 10); // <-- ADDED FIELD

      const record = {
        towerId: isNaN(towerId) ? null : towerId,
        timestamp: isNaN(timestamp) ? null : timestamp,
        temperature: isNaN(temperature) ? null : temperature,
        humidity: parseFloat(item['Humidity']),
        pressure: parseFloat(item['Pressure']),
        gas_resistance: isNaN(gasResistance) ? null : gasResistance,
        altitude: parseFloat(item['Altitude']),
        voltage: isNaN(voltage) ? null : voltage,
      };

      return record.towerId && record.timestamp && 
        !isNaN(record.temperature) && 
        !isNaN(record.gas_resistance) && 
        !isNaN(record.voltage)
        ? record
        : null;
    
    });


    // 2. temperature.csv
    await importCSV('../data/temperature.csv', TemperatureData, item => ({
      AMTemp1: parseFloat(item['AMTemp1(℃)']),
      EacToday: parseFloat(item['EacToday(kWh)'])
    }));

    // 3. daily_sample.csv
    await importCSV('../data/daily_sample.csv', DailySample, item => ({
      Time: new Date(item['Time']),
      EacToday: parseFloat(item['EacToday(kWh)']),
      INVTemp: parseFloat(item['INVTemp(℃)']),
      AMTemp1: parseFloat(item['AMTemp1(℃)']),
      BTTemp: parseFloat(item['BTTemp(℃)']),
      OUTTemp: parseFloat(item['OUTTemp(℃)']),
      AMTemp2: parseFloat(item['AMTemp2(℃)']),
      next_after: parseFloat(item['next_after']),
    }));

    // 4. march_sample.csv
    await importCSV('../data/march_sample.csv', MarchSample, item => ({
      Time: new Date(item['Time']),
      EacToday: parseFloat(item['EacToday(kWh)']),
      EacTotal: parseFloat(item['EacTotal(kWh)']),
      Ppv: parseFloat(item['Ppv(W)']),
      EpvToday: parseFloat(item['EpvToday(kWh)']),
      EpvTotal: parseFloat(item['EpvTotal(kWh)']),
      TimeTotal: parseFloat(item['TimeTotal(S)']),
      IacR: parseFloat(item['IacR(A)']),
      IacS: parseFloat(item['IacS(A)']),
      IacT: parseFloat(item['IacT(A)']),
      PacR: parseFloat(item['PacR(VA)']),
      PacS: parseFloat(item['PacS(VA)']),
      PacT: parseFloat(item['PacT(VA)']),
      VacR: parseFloat(item['VacR(V)']),
      VacS: parseFloat(item['VacS(V)']),
      VacT: parseFloat(item['VacT(V)']),
      Pac: parseFloat(item['Pac(W)']),
      INVTemp: parseFloat(item['INVTemp(℃)']),
      AMTemp1: parseFloat(item['AMTemp1(℃)']),
      BTTemp: parseFloat(item['BTTemp(℃)']),
      OUTTemp: parseFloat(item['OUTTemp(℃)']),
      AMTemp2: parseFloat(item['AMTemp2(℃)']),
      ReactPower: parseFloat(item['ReactPower(Var)']),
      ReactPowerMax: parseFloat(item['ReactPowerMax(Var)']),
      ReactPower_Total: parseFloat(item['ReactPower_Total(kWh)']),
      Date: new Date(item['Date']),
    }));

    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Error:', err);
    mongoose.disconnect();
  });
