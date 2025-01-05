const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Appointment = require('../models/Appointment'); // Ensure you import Appointment if needed

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    console.log('Incoming request body:', req.body);
    const { first_name, last_name, PESEL, password, phone_number } = req.body;

    if (!first_name || !last_name || !PESEL || !password || !phone_number) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ PESEL });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this PESEL already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            _id: uuidv4(),
            first_name,
            last_name,
            PESEL,
            password: hashedPassword,
            phone_number,
        });
        console.log('New user _id:', newUser._id);

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// Fetch all users
router.get('/', async (req, res) => {
    const { specialization } = req.query; // Get specialization from query parameters
    try {
        const query = { role: 'doctor' }; // Base query for doctors
        if (specialization) {
            query.specialization = specialization; // Add specialization filter if provided
        }
        
        const doctors = await User.find(query); // Fetch doctors based on the constructed query
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ message: 'Error fetching doctors' });
    }
});


// Update user role and specialization by ID
router.put('/:id', async (req, res) => {
    const { role, specialization } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { role, specialization },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user', error });
    }
});

// Delete user by ID
router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user', error });
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { PESEL, password } = req.body;

    try {
        const user = await User.findOne({ PESEL });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({ message: 'Login successful', userId: user._id });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// Fetch appointments for a specific PESEL
router.get('/appointments/:pesel', async (req, res) => {
    try {
        const { pesel } = req.params;
        const appointments = await Appointment.find({ pesel });

        if (!appointments || appointments.length === 0) {
            return res.status(404).json({ message: 'No appointments found' });
        }

        // Fetch doctor details for each appointment - assuming doctorId is stored in appointment
        const appointmentsWithDoctorDetails = await Promise.all(
            appointments.map(async (appointment) => {
                const doctor = await User.findById(appointment.doctorId, 'first_name last_name');
                return {
                    ...appointment.toObject(),
                    doctorFirstName: doctor.first_name,
                    doctorLastName: doctor.last_name,
                };
            })
        );

        res.json(appointmentsWithDoctorDetails);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Error fetching appointments' });
    }
});

// Fetch user by PESEL
router.get('/pesel/:pesel', async (req, res) => {
    try {
        const { pesel } = req.params;
        
        const user = await User.findOne({ PESEL: pesel });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user by PESEL:', error);
        res.status(500).json({ message: 'Error fetching user' });
    }
});

router.get('/api/users', async (req, res) => {
    const { specialization } = req.query;
    try {
        const query = specialization ? { specialization, role: 'doctor' } : { role: 'doctor' };
        const doctors = await User.find(query); // Filter by specialization if provided
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ message: 'Error fetching doctors' });
    }
});

module.exports = router;
