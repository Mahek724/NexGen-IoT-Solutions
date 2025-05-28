const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  id: String,
  title: String,
  summary: String,
  content: String
});

module.exports = mongoose.model('Project', ProjectSchema);
