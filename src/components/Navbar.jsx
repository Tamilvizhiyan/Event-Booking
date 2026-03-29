import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, LayoutDashboard, LogOut, Ticket, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, userData, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Events', path: '/events', icon: Calendar },
    ...(user ? [{ name: 'My Bookings', path: '/bookings', icon: Ticket }] : []),
    ...(isAdmin ? [{ name: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-white/5 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-indigo-500/20 shadow-lg">
                EV
              </div>
              <span className="font-bold text-xl tracking-tight text-white">Eventify<span className="text-blue-400">Hub</span></span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center space-x-1 text-sm font-medium transition-colors hover:text-blue-400 ${
                    isActive ? 'text-blue-400' : 'text-slate-300'
                  }`
                }
              >
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
              </NavLink>
            ))}

            {user ? (
               <div className="flex items-center space-x-4 pl-4 border-l border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden border border-white/20">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="text-slate-400 w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-slate-200 hidden lg:inline-block">
                    {userData?.displayName || 'User'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-sm text-rose-400 hover:text-rose-300 font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/20"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/5 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
               {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-3 rounded-md text-base font-medium transition-colors ${
                      isActive ? 'bg-blue-600/10 text-blue-400' : 'text-slate-300 hover:bg-slate-800'
                    }`
                  }
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </NavLink>
              ))}

              {user ? (
                <>
                  <div className="flex items-center space-x-3 px-3 py-4 border-t border-white/5 mt-4">
                     <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden">
                       {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="text-slate-400 m-2" />
                      )}
                    </div>
                    <div>
                      <div className="text-base font-medium text-white">{userData?.displayName}</div>
                      <div className="text-sm font-medium text-slate-400">{user.email}</div>
                    </div>
                  </div>
                   <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-3 rounded-md text-base font-medium text-rose-400 hover:bg-rose-600/10 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="pt-4 pb-3 space-y-1 border-t border-white/5">
                   <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-3 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    Login
                  </Link>
                   <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-3 rounded-md text-base font-medium text-blue-400 hover:bg-blue-600/10 transition-colors font-bold"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
