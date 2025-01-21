const express = require('express');
const Role = require('../models/Role'); // Upewnij się, że model Role jest zaimportowany

const router = express.Router();

// Pobierz rolę po nazwie
router.get('/:name', async (req, res) => {
    try {
        const { name } = req.params; // Pobierz nazwę roli z parametrów żądania
        const role = await Role.findOne({ name }); // Szukamy roli po nazwie
        
        if (!role) {
            return res.status(404).json({ message: 'Rola nie została znaleziona' });
        }

        res.json(role); // Zwróć znalezioną rolę
    } catch (error) {
        console.error('Błąd przy pobieraniu roli:', error);
        res.status(500).json({ message: 'Błąd przy pobieraniu roli', error });
    }
});

module.exports = router;
