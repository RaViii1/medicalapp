const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes'); // Ensure this path is correct
const specializationRoutes = require('./routes/specializationRoutes'); // Assuming you have this file as well.
const appointmentRoutes = require('./routes/appointmentRoutes'); // Assuming you have this file as well.
const roleRoutes = require('./routes/roleRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// API routes
app.use('/api/users', userRoutes); // This should match your route definitions in userRoutes.js
app.use('/api/specializations', specializationRoutes); // Ensure this is set up correctly.
app.use('/api/appointments', appointmentRoutes); // Ensure this is set up correctly.
app.use('/api/roles', roleRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
