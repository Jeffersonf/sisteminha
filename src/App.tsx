import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Users, Home, MapPin, Calendar } from 'lucide-react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Residents from './pages/Residents';
import Visits from './pages/Visits';
import Residences from './pages/Residences';

function App() {
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Residentes', path: '/residents' },
    { icon: MapPin, label: 'Residências', path: '/residences' },
    { icon: Calendar, label: 'Visitas', path: '/visits' },
  ];

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar items={navItems} />
        <main className="p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/residents" element={<Residents />} />
            <Route path="/residences" element={<Residences />} />
            <Route path="/visits" element={<Visits />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;