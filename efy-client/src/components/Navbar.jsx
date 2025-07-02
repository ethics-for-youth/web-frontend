import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-green-950 text-white shadow-sm shadow-green-800/30 px-6 py-5 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img
          src="/logo.png" // ✅ Replace with your actual logo path
          alt="Ethics for Youth Logo"
          className="w-10 h-10 object-cover rounded-full shadow-sm"
        />
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
          Ethics for Youth
        </h1>
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
