const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Project = require('./models/Project');

const projects = [
  { id: 'battery', title: 'Battery Health Monitoring', summary: 'Monitors battery health using IoT + ML.', content: 'Uses ESP32, voltage, temperature, and gas sensors. Predicts battery failure using ML models like Gradient Boosting and Random Forest.' },
  { id: 'solar', title: 'Rooftop Solar Monitoring', summary: 'Tracks solar panel health with sensors.', content: 'Monitors dust, temperature, CO2, and light intensity using MQ135, SDS011, BME680. Data sent to ThingSpeak with real-time buzzer alerts.' },
  { id: 'robotics', title: 'Robotics Educational Platform', summary: 'Learn robotics with real robot arm.', content: 'Features 3R manipulator, live challenges, scoring, and safety features. Controlled via web interface using ESP.' },
  { id: 'hemm', title: 'HEMM Dispatch Optimization', summary: 'Smart fleet management for mines.', content: 'Uses GPS, Arduino, and MQTT to optimize dispatch, track HEMMs, and form platoons in real-time with web dashboard.' }
];

const seedDB = async () => {
  await connectDB();
  await Project.deleteMany();
  await Project.insertMany(projects);
  console.log('Seeded DB!');
  mongoose.connection.close();
};

seedDB();
