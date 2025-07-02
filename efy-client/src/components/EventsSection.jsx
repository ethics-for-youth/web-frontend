import React from 'react';
import { useNavigate } from 'react-router-dom';

const EventsSection = () => {
  const navigate = useNavigate();

  return (
    <section
      id="events"
      className="relative py-20 px-6 bg-gradient-to-br from-green-50 via-white to-green-100 text-gray-800"
    >
      {/* Decorative glow */}
      <div className="absolute top-10 -left-10 w-64 h-64 bg-green-100 opacity-30 blur-3xl rounded-full pointer-events-none hidden md:block" />

      <h3 className="text-4xl font-extrabold text-center text-green-700 mb-12 tracking-tight hover:tracking-wider transition-all duration-300">
        🌟 Upcoming Events
      </h3>

      <div className="flex flex-col md:flex-row justify-center gap-12 relative z-10">
        {/* Course Card */}
        <div className="bg-white rounded-2xl shadow-lg border-l-4 border-green-600 hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 max-w-sm w-full p-10">
          <h4 className="text-xl font-semibold text-green-700 mb-1">
            Akhlaq Essentials: Youth Edition
          </h4>
          <p className="text-sm text-gray-500 mb-3">Short Course · July 2024</p>
          <ul className="text-sm text-gray-700 space-y-1 mb-4 leading-relaxed">
            <li>📅 11th, 12th, 13th July</li>
            <li>⏰ 1hr 15min/day</li>
            <li>🌐 Online · 👦 50 boys + 👧 50 girls</li>
            <li>✨ 30-minute interactive Q&A included</li>
          </ul>
        <button
  onClick={() => navigate('/register')}
  className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white py-2 rounded-lg font-medium  shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
>
  Register Now
</button>
        </div>

        {/* Competition Card */}
        <div className="bg-yellow-50 rounded-2xl shadow-lg border-l-4 border-yellow-400 hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 max-w-sm w-full p-6">
          <h4 className="text-xl font-semibold text-yellow-700 mb-1">
            Open Book Competition
          </h4>
          <p className="text-sm text-gray-600 mb-3">Challenge Your Knowledge</p>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            Test your understanding of Islamic values in this fun and rewarding competition.
            Learn, reflect, and grow as you compete with fellow youth for meaningful prizes
            in a spiritually uplifting setting.
          </p>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border border-yellow-300 px-3 py-2 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white py-2 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            Notify Me
          </button>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
