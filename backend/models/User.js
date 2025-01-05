const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); 
const Role = require('./Role'); // Import the Role model
const Appointment = require('./Appointment'); // Import the Appointment model

const userSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 }, // Use UUID as the default for _id
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  PESEL: { type: String, required: true, unique: true }, // Unique identifier
  password: { type: String, required: true },
  phone_number: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', default: null }, // Role reference
  specialization: { type: String, default: null }, // Add this line for specialization
  created_at: { type: Date, default: Date.now }, // Automatically set creation date
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }] // Reference to appointments
});

userSchema.pre('save', async function(next) {
  if (!this.role) {
    const defaultRole = await Role.findOne({ name: 'user' }); // Assuming "user" role exists
    this.role = defaultRole._id; // Assign default role
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
