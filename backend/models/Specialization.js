const mongoose = require('mongoose');

const specializationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const Specialization = mongoose.model('Specialization', specializationSchema);

module.exports = Specialization;
