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

// Update specialization by ID
router.put('/:id', async (req, res) => {
    const { name, description } = req.body;

    try {
        const updatedSpecialization = await Specialization.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );
        if (!updatedSpecialization) {
            return res.status(404).json({ message: 'Specialization not found' });
        }
        res.json(updatedSpecialization);
    } catch (error) {
        console.error('Error updating specialization:', error);
        res.status(500).json({ message: 'Error updating specialization', error });
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
