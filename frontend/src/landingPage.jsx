import React from 'react';

const Home = () => {
  const isLoggedIn = localStorage.getItem('token') !== null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white p-6">
        <h1 className="text-3xl font-bold text-center">System Obsługi Przychodni Medycznej</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6">
        <section className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4">Witamy w naszej aplikacji!</h2>
          <p className="mb-4">
            Projektowany system informatyczny ma na celu usprawnienie obsługi małej przychodni medycznej poprzez przeniesienie tradycyjnego systemu rejestracji pacjentów, opartego na papierowych dokumentach, na nowoczesną platformę internetową.
          </p>
          <p className="mb-4">
            Dzięki temu procesy rejestracji pacjentów, umawiania wizyt oraz zarządzania harmonogramem lekarzy staną się bardziej zorganizowane, efektywne i wygodne zarówno dla personelu przychodni, jak i dla pacjentów.
          </p>
          <p className="mb-4">
            Aplikacja zautomatyzuje wiele zadań, co pozwoli na szybsze i bardziej precyzyjne zarządzanie wizytami oraz dokumentacją medyczną.
          </p>

          {/* Features Section */}
          <h3 className="text-xl font-semibold mt-6 mb-2">Funkcje aplikacji:</h3>
          <ul className="list-disc list-inside mb-4">
            <li>Rejestracja pacjentów online</li>
            <li>Umawianie wizyt u lekarzy</li>
            <li>Zarządzanie harmonogramem lekarzy</li>
            <li>Automatyczne przypomnienia o wizytach</li>
            <li>Dostęp do dokumentacji medycznej pacjentów</li>
          </ul>

          {/* Call to Action */}
          <div className="mt-6 text-center">
            {!isLoggedIn && (
              <>
                <a href="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200">
                  Zarejestruj się
                </a>
                <span className="mx-2">lub</span>
                <a href="/login" className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition duration-200">
                  Zaloguj się
                </a>
              </>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        &copy; {new Date().getFullYear()} Przychodnia Medyczna. Wszelkie prawa zastrzeżone.
      </footer>
    </div>
  );
};

export default Home;
