const express = require('express');
const Specialization = require('../models/Specialization');

const router = express.Router();

// Get all specializations
router.get('/', async (req, res) => {
    try {
        const specializations = await Specialization.find();
        res.json(specializations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching specializations', error });
    }
});

// Create a new specialization
router.post('/', async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ message: 'Name and description are required' });
    }

    const newSpecialization = new Specialization({ name, description });

    try {
        await newSpecialization.save();
        res.status(201).json(newSpecialization);
    } catch (error) {
        res.status(500).json({ message: 'Error creating specialization', error });
    }
});

router.put('/:id', async (req, res) => {
    const { role, specialization } = req.body;

    try {
        // Find the role ID for the provided role name
        const roleDoc = await Role.findOne({ name: role }); // Assuming 'role' is passed as a string

        if (!roleDoc) {
            return res.status(400).json({ message: 'Role not found' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { role: roleDoc._id, specialization }, // Use ObjectId of role
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


// Delete specialization by ID
router.delete('/:id', async (req, res) => {
    try {
        await Specialization.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting specialization', error });
    }
});

module.exports = router;
