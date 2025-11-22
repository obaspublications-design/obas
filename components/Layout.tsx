
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, Phone, Mail, MapPin, ShieldCheck, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { NotificationType } from '../types';

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  const { config, isAdmin, logout, notifications, removeNotification } = useSite();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (path: string) => location.pathname === path ? 'text-secondary font-bold' : 'text-gray-700 hover:text-primary';

  const Toast = ({ id, message, type }: { id: string, message: string, type: NotificationType }) => {
    const bgColors = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800'
    };
    const Icons = {
      success: CheckCircle,
      error: AlertCircle,
      info: Info
    };
    const Icon = Icons[type];

    return (
      <div className={`flex items-center p-4 mb-3 rounded-lg border shadow-lg animate-fade-in-up ${bgColors[type]} min-w-[300px] max-w-md`}>
        <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
        <span className="flex-grow text-sm font-medium">{message}</span>
        <button onClick={() => removeNotification(id)} className="ml-4 text-gray-400 hover:text-gray-600">
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[60] flex flex-col items-end pointer-events-none">
        <div className="pointer-events-auto">
          {notifications.map(n => (
            <Toast key={n.id} {...n} />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="font-serif text-2xl font-bold text-primary">{config.siteName}</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8 items-center">
              <Link to="/" className={isActive('/')}>Home</Link>
              <Link to="/services" className={isActive('/services')}>Services</Link>
              <Link to="/process" className={isActive('/process')}>Process</Link>
              <Link to="/resources" className={isActive('/resources')}>Resources & Tools</Link>
              <Link to="/contact" className={isActive('/contact')}>Contact</Link>
              {isAdmin ? (
                 <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                    <Link to="/admin" className="text-primary font-bold flex items-center bg-blue-50 px-3 py-1 rounded-full text-sm">
                      Admin Panel
                    </Link>
                    <button onClick={logout} className="text-sm text-gray-500 hover:text-red-600 transition">Logout</button>
                 </div>
              ) : (
                <Link to="/contact" className="bg-secondary text-white px-5 py-2 rounded-md font-semibold hover:bg-yellow-600 transition shadow-sm">
                  Request Quote
                </Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50" onClick={toggleMenu}>Home</Link>
              <Link to="/services" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50" onClick={toggleMenu}>Services</Link>
              <Link to="/process" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50" onClick={toggleMenu}>Process</Link>
              <Link to="/resources" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50" onClick={toggleMenu}>Resources</Link>
              <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50" onClick={toggleMenu}>Contact</Link>
              {isAdmin && (
                 <div className="border-t border-gray-100 mt-2 pt-2">
                    <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-primary bg-blue-50" onClick={toggleMenu}>Admin Dashboard</Link>
                    <button onClick={() => { logout(); toggleMenu(); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">Logout</button>
                 </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6 text-secondary" />
                <span className="font-serif text-xl font-bold">{config.siteName}</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Supporting the Nigerian academic community with world-class editing and publication services.
              </p>
            </div>
            <div>
              <h3 className="font-serif font-semibold text-lg mb-4 text-secondary">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/services" className="hover:text-white">Our Services</Link></li>
                <li><Link to="/process" className="hover:text-white">How It Works</Link></li>
                <li><Link to="/resources" className="hover:text-white">AI Title Tool</Link></li>
                <li><Link to="/admin" className="hover:text-white">Admin Portal</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-serif font-semibold text-lg mb-4 text-secondary">Contact Us</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span>{config.contactAddress}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-secondary flex-shrink-0" />
                  <span>{config.contactPhone}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-secondary flex-shrink-0" />
                  <span>{config.contactEmail}</span>
                </li>
                <li className="flex items-center space-x-2">
                   <ShieldCheck className="h-4 w-4 text-secondary flex-shrink-0" />
                   <span>Strictly Confidential</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-900 mt-8 pt-8 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} {config.siteName}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
