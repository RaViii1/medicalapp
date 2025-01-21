const express = require('express');
const Appointment = require('../models/Appointment');
const User = require('../models/User'); // Ensure User model is imported
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

        req.userId = decoded.id; // Dodajemy ID użytkownika do żądania
        next(); // Przechodzimy do kolejnej funkcji
    });
}

// Tworzenie nowego terminu - dostępne tylko dla lekarzy i pacjentów
router.post('/', verifyToken, async (req, res) => {
    const { doctorId, date, pesel } = req.body; // Pobieramy doctorId, date i pesel z ciała żądania

    // Walidacja wymaganych pól
    if (!doctorId || !date || !pesel) {
        return res.status(400).json({ message: 'Wymagane są ID lekarza, data i PESEL' });
    }

    try {
        const newAppointment = new Appointment({ doctorId, date, pesel });
        await newAppointment.save(); // Zapisz do bazy danych
        res.status(201).json(newAppointment); // Zwróć utworzony termin
    } catch (error) {
        console.error('Błąd przy umawianiu terminu:', error);
        res.status(500).json({ message: 'Błąd przy umawianiu terminu', error });
    }
});

// Pobierz terminy dla określonego PESEL - dostępne tylko dla użytkowników z rolą 'pacjent' lub odpowiedniego lekarza
router.get('/appointments/:pesel', verifyToken, async (req, res) => {
    const { pesel } = req.params; // Pobieramy PESEL z parametrów żądania
    console.log('Pobieranie terminów dla PESEL:', pesel); // Logowanie przychodzącego PESEL

    try {
        // Szukamy terminów powiązanych z danym PESEL
        const appointments = await Appointment.find({ pesel });

        if (!appointments || appointments.length === 0) {
            console.log('Brak terminów dla tego PESEL'); // Logowanie, gdy brak terminów
            return res.status(404).json({ message: 'Brak terminów dla tego PESEL' });
        }

        // Pobieramy szczegóły lekarza dla każdego terminu
        const appointmentsWithDoctorDetails = await Promise.all(
            appointments.map(async (appointment) => {
                const doctor = await User.findById(appointment.doctorId, 'first_name last_name'); // Pobieranie imienia i nazwiska lekarza
                
                return {
                    ...appointment.toObject(),
                    doctorFirstName: doctor ? doctor.first_name : null,
                    doctorLastName: doctor ? doctor.last_name : null,
                };
            })
        );

        console.log('Pobrano terminy z danymi lekarzy:', appointmentsWithDoctorDetails); // Logowanie pobranych terminów z danymi lekarzy
        res.json(appointmentsWithDoctorDetails); // Zwróć terminy użytkownika z danymi lekarzy
    } catch (error) {
        console.error('Błąd przy pobieraniu terminów:', error);
        res.status(500).json({ message: 'Błąd przy pobieraniu terminów', error });
    }
});

module.exports = router;
