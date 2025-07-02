import React from 'react';
import logo from '../assets/logo.png'; 

const Navbar = () => {
  return (
   <nav className="bg-emerald-800 text-white shadow-sm shadow-green-800/30 px-6 h-16 flex items-center justify-between">
  {/* Logo */}
  <div className="flex items-center">
    <img
      src={logo}
      alt="Ethic for Youth Logo"
      className="pl-5 h-24 w-auto object-contain"
    />
  </div>



      {/* Navigation Links */}
      <ul className="hidden md:flex gap-6 text-sm font-medium">
        {['Home', 'Events', 'Courses', 'Donation'].map((item, idx) => (
          <li
            key={idx}
            className="relative group cursor-pointer transition-all duration-300"
          >
            <span className="group-hover:text-green-300 transition-colors">
              {item}
            </span>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-300 transition-all duration-300 group-hover:w-full"></div>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
