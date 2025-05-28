const mongoose = require('mongoose');
const chalk = require('chalk').default;

const connectDB = async () => {
  try {
    console.log('Connecting to Mongo URI:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log(chalk.yellow('MongoDB connected'));
  } catch (err) {
    console.error(chalk.red('MongoDB connection error:'), err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
