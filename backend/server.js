require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const projectRoutes = require('./routes/projects');
const batteryRoutes = require('./routes/battery');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/projects', projectRoutes);
app.use('/api/battery', batteryRoutes);


const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
