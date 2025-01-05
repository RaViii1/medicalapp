
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = process.env.PORT || 5000;
const axios = require('axios');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB

const mongoURI = process.env.MONGODB_URL;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


// Routes
const userRoutes = require('./routes/userRoutes');
const specializationRoutes = require('./routes/specializationRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

// API routes
app.use('/api/users', userRoutes);
app.use('/api/specializations', specializationRoutes);
app.use('/api/appointments', appointmentRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


