// Importowanie wymaganych modułów
const { MongoClient } = require('mongodb');
require('dotenv').config(); // Ładowanie zmiennych środowiskowych z pliku .env

// Odczytanie danych połączenia z pliku .env
const url = process.env.MONGODB_URL;
const dbName = process.env.DB_NAME;

async function createDatabase() {
  const client = new MongoClient(url);

  try {
    // Połączenie z klientem
    await client.connect();
    console.log('Połączono z bazą danych');

    const db = client.db(dbName);

    // Tworzenie kolekcji i dodawanie indeksów
    await db.createCollection('users');
    await db.createCollection('Administrators');
    await db.createCollection('Doctors');
    await db.createCollection('Patients');
    await db.createCollection('Specializations');
    await db.createCollection('Appointments');
    await db.createCollection('Notes');

    // Dodawanie indeksów
    await db.collection('users').createIndex({ id: 1 }, { unique: true });
    await db.collection('Administrators').createIndex({ user_id: 1 }, { unique: true });
    await db.collection('Doctors').createIndex({ user_id: 1 }, { unique: true });
    await db.collection('Patients').createIndex({ user_id: 1 }, { unique: true });
    
    console.log('Kolekcje zostały utworzone i indeksy dodane.');

  } catch (error) {
    console.error('Wystąpił błąd podczas tworzenia bazy danych:', error);
  } finally {
    // Zamknięcie połączenia
    await client.close();
  }
}

createDatabase();
