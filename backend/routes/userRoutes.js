const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Role = require('../models/Role');
const Specialization = require('../models/Specialization');
const Appointment = require('../models/Appointment'); // Ensure you import Appointment if needed

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    console.log('Incoming request body:', req.body);
    const { first_name, last_name, PESEL, password, phone_number } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !PESEL || !password || !phone_number) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check for existing user with the same PESEL
        const existingUser = await User.findOne({ PESEL });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this PESEL already exists' });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            _id: uuidv4(),
            first_name,
            last_name,
            PESEL,
            password: hashedPassword,
            phone_number,
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// Fetch all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users
        
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.json(users); // Return the fetched users
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

// Fetch only doctors
router.get('/doctors', async (req, res) => {
    try {
        // Find the role ID for 'doctor'
        const doctorRole = await Role.findOne({ name: 'doctor' });
        
        if (!doctorRole) {
            return res.status(404).json({ message: 'Doctor role not found' });
        }

        const doctors = await User.find({ role: doctorRole._id }); // Use ObjectId of doctor role
        
        if (!doctors || doctors.length === 0) {
            return res.status(404).json({ message: 'No doctors found' });
        }

        res.json(doctors); // Return the fetched doctors
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ message: 'Error fetching doctors', error });
    }
});

// Update user role and specialization by ID
router.put('/:id', async (req, res) => {
    const { role, specialization } = req.body;

    try {
        // Validate input
        if (!role) {
            return res.status(400).json({ message: 'Role is required' });
        }

        // Update user with new role and specialization
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { role, specialization }, // Directly use the provided role and specialization
            { new: true } // Return the updated document
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
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(204).send(); // No content response for successful deletion
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
        
        console.log('Fetching appointments for PESEL:', pesel); // Log incoming PESEL

        // Find appointments associated with the user's PESEL
        const appointments = await Appointment.find({ pesel });

        if (!appointments || appointments.length === 0) {
            console.log('No appointments found for this PESEL'); // Log if no appointments are found
            return res.status(404).json({ message: 'No appointments found' });
        }

        // Fetch doctor details for each appointment - assuming doctorId is stored in appointment
        const appointmentsWithDoctorDetails = await Promise.all(
            appointments.map(async (appointment) => {
                const doctor = await User.findById(appointment.doctorId, 'first_name last_name'); // Fetch doctor's name
                
                return {
                    ...appointment.toObject(),
                    doctorFirstName: doctor ? doctor.first_name : null,
                    doctorLastName: doctor ? doctor.last_name : null,
                };
            })
        );

        console.log('Fetched appointments with doctor details:', appointmentsWithDoctorDetails); // Log fetched appointments with doctor details
        res.json(appointmentsWithDoctorDetails); // Return the user's appointments with doctor details
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

        res.json(user); // Return the found user
    } catch (error) {
        console.error('Error fetching user by PESEL:', error);
        res.status(500).json({ message: 'Error fetching user', error });
    }
});

module.exports = router;
