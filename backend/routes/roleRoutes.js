const express = require('express');
const Role = require('../models/Role'); // Ensure you import the Role model

const router = express.Router();

// Fetch role by name
router.get('/:name', async (req, res) => {
    try {
        const { name } = req.params; // Get role name from request parameters
        const role = await Role.findOne({ name }); // Find role by name
        
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }

        res.json(role); // Return the found role
    } catch (error) {
        console.error('Error fetching role:', error);
        res.status(500).json({ message: 'Error fetching role', error });
    }
});

module.exports = router;
