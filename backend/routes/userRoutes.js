const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Role = require('../models/Role');
const Specialization = require('../models/Specialization');
const Appointment = require('../models/Appointment');
require('dotenv').config();

const router = express.Router();

// Funkcja do generowania tokenu JWT z rolą
function generateToken(user) {
    return jwt.sign(
        { id: user._id, role: user.role }, // Dodajemy rolę do payload tokenu
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }  // Token wygasa po godzinie
    );
}

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

        req.userId = decoded.id;  // ID użytkownika
        req.userRole = decoded.role;  // Rola użytkownika z tokenu
        next();
    });
}

// Middleware do weryfikacji roli
function verifyRole(requiredRole) {
    return (req, res, next) => {
        const { role } = req.userRole; // Używamy roli użytkownika w tokenie

        console.log(role)

        if (role !== requiredRole) {
            return res.status(403).json({ message: 'Odmowa dostępu: Niedostateczna rola' });
        }

        next(); // Przechodzimy dalej, jeśli rola jest odpowiednia
    };
}

// Logowanie użytkownika i generowanie tokenu
router.post('/login', async (req, res) => {
    const { PESEL, password } = req.body;

    try {
        const user = await User.findOne({ PESEL });
        if (!user) {
            return res.status(401).json({ message: 'Nieprawidłowe dane logowania' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Nieprawidłowe dane logowania' });
        }

        // Generowanie tokenu JWT po pomyślnym logowaniu
        const token = generateToken(user);
        res.json({ message: 'Logowanie zakończone sukcesem', token });
    } catch (error) {
        res.status(500).json({ message: 'Błąd przy logowaniu', error });
    }
});

// Rejestracja nowego użytkownika
router.post('/register', async (req, res) => {
    console.log('Otrzymane dane:', req.body);
    const { first_name, last_name, PESEL, password, phone_number} = req.body;


    // Walidacja wymaganych pól
    if (!first_name || !last_name || !PESEL || !password || !phone_number) {
        return res.status(400).json({ message: 'Wszystkie pola są wymagane' });
    }

    try {
        const existingUser = await User.findOne({ PESEL });
        if (existingUser) {
            return res.status(400).json({ message: 'Użytkownik z tym PESEL już istnieje' });
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

        await newUser.save();
        res.status(201).json({ message: 'Użytkownik zarejestrowany pomyślnie' });
    } catch (error) {
        console.error('Błąd przy rejestracji użytkownika:', error);
        res.status(500).json({ message: 'Błąd przy rejestracji użytkownika', error });
    }
});

// Pobierz wszystkich użytkowników
router.get('/', verifyToken, async (req, res) => {
    try {
        const users = await User.find(); // Pobierz wszystkich użytkowników
        
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'Brak użytkowników' });
        }

        res.json(users); // Zwróć pobranych użytkowników
    } catch (error) {
        console.error('Błąd przy pobieraniu użytkowników:', error);
        res.status(500).json({ message: 'Błąd przy pobieraniu użytkowników', error });
    }
});

// Pobierz tylko lekarzy (dla użytkowników z rolą 'doctor')
router.get('/doctors', verifyToken, async (req, res) => {
    try {
        // Znajdź rolę 'doctor'
        const doctorRole = await Role.findOne({ name: 'doctor' });

        if (!doctorRole) {
            return res.status(404).json({ message: 'Rola lekarza nie została znaleziona' });
        }

        const doctors = await User.find({ role: doctorRole._id }); // Użyj ObjectId roli lekarza
        
        if (!doctors || doctors.length === 0) {
            return res.status(404).json({ message: 'Brak lekarzy' });
        }

        res.json(doctors); // Zwróć pobranych lekarzy
    } catch (error) {
        console.error('Błąd przy pobieraniu lekarzy:', error);
        res.status(500).json({ message: 'Błąd przy pobieraniu lekarzy', error });
    }
});

// Zaktualizuj rolę użytkownika i specjalizację po ID
router.put('/:id', verifyToken, async (req, res) => {
    const { role, specialization } = req.body;

    try {
        // Walidacja danych wejściowych
        if (!role) {
            return res.status(400).json({ message: 'Rola jest wymagana' });
        }

        // Zaktualizuj użytkownika o nową rolę i specjalizację
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { role, specialization }, // Bezpośrednio użyj podanej roli i specjalizacji
            { new: true } // Zwróć zaktualizowany dokument
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'Użytkownik nie został znaleziony' });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error('Błąd przy aktualizacji użytkownika:', error);
        res.status(500).json({ message: 'Błąd przy aktualizacji użytkownika', error });
    }
});

// Usuń użytkownika po ID
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        
        if (!deletedUser) {
            return res.status(404).json({ message: 'Użytkownik nie został znaleziony' });
        }
        
        res.status(204).send(); // Brak zawartości w odpowiedzi po udanym usunięciu
    } catch (error) {
        console.error('Błąd przy usuwaniu użytkownika:', error);
        res.status(500).json({ message: 'Błąd przy usuwaniu użytkownika', error });
    }
});

// Pobierz wizyty dla określonego PESEL
router.get('/appointments/:pesel', verifyToken, async (req, res) => {
    try {
        const { pesel } = req.params;
        
        console.log('Pobieranie wizyt dla PESEL:', pesel); // Logowanie przychodzącego PESEL

        // Znajdź wizyty związane z PESEL użytkownika
        const appointments = await Appointment.find({ pesel });

        if (!appointments || appointments.length === 0) {
            console.log('Brak wizyt dla tego PESEL'); // Logowanie, jeśli brak wizyt
            return res.status(404).json({ message: 'Brak wizyt' });
        }

        // Pobierz dane lekarzy dla każdej wizyty - zakładając, że doctorId jest zapisane w wizycie
        const appointmentsWithDoctorDetails = await Promise.all(
            appointments.map(async (appointment) => {
                const doctor = await User.findById(appointment.doctorId, 'first_name last_name'); // Pobierz imię i nazwisko lekarza
                
                return {
                    ...appointment.toObject(),
                    doctorFirstName: doctor ? doctor.first_name : null,
                    doctorLastName: doctor ? doctor.last_name : null,
                };
            })
        );

        console.log('Pobrano wizyty z danymi lekarzy:', appointmentsWithDoctorDetails); // Logowanie pobranych wizyt
        res.json(appointmentsWithDoctorDetails); // Zwróć wizyty użytkownika z danymi lekarzy
    } catch (error) {
        console.error('Błąd przy pobieraniu wizyt:', error);
        res.status(500).json({ message: 'Błąd przy pobieraniu wizyt' });
    }
});

// Pobierz użytkownika po PESEL
router.get('/pesel/:pesel', verifyToken, async (req, res) => {
    try {
        const { pesel } = req.params;
        
        const user = await User.findOne({ PESEL: pesel });

        if (!user) {
            return res.status(404).json({ message: 'Użytkownik nie został znaleziony' });
        }

        res.json(user); // Zwróć znalezionego użytkownika
    } catch (error) {
        console.error('Błąd przy pobieraniu użytkownika po PESEL:', error);
        res.status(500).json({ message: 'Błąd przy pobieraniu użytkownika', error });
    }
});

module.exports = router;
