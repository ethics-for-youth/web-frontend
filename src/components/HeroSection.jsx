import React from 'react';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-green-50 to-white py-20 px-6  text-center relative overflow-hidden">

      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-green-100 rounded-full opacity-30 blur-3xl pointer-events-none"></div>

      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-extrabold text-green-800 leading-snug drop-shadow-sm">
        Nurturing Noble Character <br className="hidden md:block" /> 
        <span className="text-green-600">Through the Light of Islam</span>
      </h2>

      {/* Description */}
      <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-gray-700 leading-relaxed">
        Join a transformative 3-day journey to explore Islamic manners and values rooted in the Quran and the Sunnah. Strengthen your character, follow the Prophet’s ﷺ example, and become a guiding light for your community.
      </p>

      {/* CTA Button */}
      <button
        onClick={() =>
          document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })
        }
        className="mt-8 inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full shadow-md text-sm font-medium transition-all duration-300 hover:scale-105"
      >
        🌟 Register for Upcoming Course
      </button>
    </section>
  );
};

export default HeroSection;
