const express = require('express');
const Specialization = require('../models/Specialization');
const Role = require('../models/Role');
const jwt = require('jsonwebtoken'); 

const router = express.Router();

// Middleware do weryfikacji tokenu JWT
function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Token jest wymagany' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Nieprawidłowy lub wygasły token' });
        }

        req.userId = decoded.id; // Dodanie ID użytkownika do żądania
        req.userRole = decoded.role; // Dodanie roli użytkownika do żądania
        next(); // Przechodzimy do następnej funkcji w łańcuchu
    });
}

// Pobierz wszystkie specjalizacje
router.get('/', verifyToken, async (req, res) => {
    try {
        const specializations = await Specialization.find();
        res.json(specializations);
    } catch (error) {
        res.status(500).json({ message: 'Błąd przy pobieraniu specjalizacji', error });
    }
});

// Utwórz nową specjalizację - dostępne tylko dla użytkowników z rolą 'admin'
router.post('/', verifyToken, async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ message: 'Nazwa i opis są wymagane' });
    }

    const newSpecialization = new Specialization({ name, description });

    try {
        await newSpecialization.save();
        res.status(201).json(newSpecialization);
    } catch (error) {
        res.status(500).json({ message: 'Błąd przy tworzeniu specjalizacji', error });
    }
});

// Zaktualizuj specjalizację po ID - dostępne tylko dla użytkowników z rolą 'admin'
router.put('/:id', verifyToken, async (req, res) => {
    const { name, description, id } = req.body; // Pobierz nazwę i opis ze zgłoszenia

    try {
        if (!name || !description) {
            return res.status(400).json({ message: 'Nazwa i opis specjalizacji są wymagane.' });
        }

        // Znajdź i zaktualizuj specjalizację po ID
        const updatedSpecialization = await Specialization.findByIdAndUpdate(
            id,
            { name, description }, // Dane do aktualizacji
            { new: true } // Opcja, aby zwrócić zaktualizowany dokument
        );

        if (!updatedSpecialization) {
            return res.status(404).json({ message: 'Specjalizacja nie została znaleziona.' });
        }

        res.json(updatedSpecialization); // Zwróć zaktualizowaną specjalizację
    } catch (error) {
        console.error('Błąd przy aktualizacji specjalizacji:', error);
        res.status(500).json({ message: 'Wystąpił błąd przy aktualizacji specjalizacji', error });
    }
});

// Usuń specjalizację po ID - dostępne tylko dla użytkowników z rolą 'admin'
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Specialization.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Błąd przy usuwaniu specjalizacji', error });
    }
});

module.exports = router;
