import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
            ? 'bg-white/70 backdrop-blur-lg shadow-sm'
            : 'bg-white/30 backdrop-blur-md'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          {/* Logo + Title */}
          <NavLink to="/" className="flex items-center gap-3">
            <div className="h-12 w-auto pl-8 flex">
              <img
                src={logo}
                alt="EFY Logo"
                className="scale-[1.9] object-contain"
              />
            </div>
            {/* <span className="text-2xl font-bold text-indigo-700 tracking-tight">
              Ethics For Youth
            </span> */}
          </NavLink>

          {/* Nav Links */}
          <div className="flex space-x-6 text-gray-800 text-base font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition duration-200 ${isActive ? 'text-indigo-600' : 'hover:text-indigo-600'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/events"
              className={({ isActive }) =>
                `transition duration-200 ${isActive ? 'text-indigo-600' : 'hover:text-indigo-600'
                }`
              }
            >
              Events
            </NavLink>
            <NavLink
              to="/courses"
              className={({ isActive }) =>
                `transition duration-200 ${isActive ? 'text-indigo-600' : 'hover:text-indigo-600'
                }`
              }
            >
              Courses
            </NavLink>
            <NavLink
              to="/donation"
              className={({ isActive }) =>
                `transition duration-200 ${isActive ? 'text-indigo-600' : 'hover:text-indigo-600'
                }`
              }
            >
              Donation
            </NavLink>
          </div>
        </div>
      </motion.nav>
    </AnimatePresence>
  );
};

export default Navbar;
