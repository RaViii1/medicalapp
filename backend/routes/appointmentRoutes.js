const express = require('express');
const Appointment = require('../models/Appointment');
const User = require('../models/User'); // Ensure User model is imported

const router = express.Router();

// Create a new appointment
router.post('/', async (req, res) => {
    const { doctorId, date, pesel } = req.body; // Get doctorId, date, and pesel from request body

    // Validate required fields
    if (!doctorId || !date || !pesel) {
        return res.status(400).json({ message: 'Doctor ID, date, and PESEL are required' });
    }

    try {
        const newAppointment = new Appointment({ doctorId, date, pesel }); // Create a new appointment
        await newAppointment.save(); // Save it to the database
        res.status(201).json(newAppointment); // Return the created appointment
    } catch (error) {
        console.error('Error scheduling appointment:', error);
        res.status(500).json({ message: 'Error scheduling appointment', error });
    }
});

// Fetch appointments for a specific PESEL
router.get('/appointments/:pesel', async (req, res) => {
    const { pesel } = req.params; // Get PESEL from request parameters
    console.log('Fetching appointments for PESEL:', pesel); // Log incoming PESEL

    try {
        // Find appointments associated with the user's PESEL
        const appointments = await Appointment.find({ pesel });

        if (!appointments || appointments.length === 0) {
            console.log('No appointments found for this PESEL'); // Log if no appointments are found
            return res.status(404).json({ message: 'No appointments found' });
        }

        // Fetch doctor details for each appointment
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
        res.status(500).json({ message: 'Error fetching appointments', error });
    }
});

module.exports = router;
