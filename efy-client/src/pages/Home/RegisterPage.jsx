import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("You’ve successfully registered!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-50 via-white to-green-100 flex items-center justify-center px-4 py-12 text-gray-800 font-sans">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 md:p-10 transition-all">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="text-sm text-green-600 mb-4 hover:underline transition"
        >
          ← Back to Home
        </button>

        {/* Header */}
        <h2 className="text-3xl font-bold text-center text-green-800 mb-2">
          Secure Your Spot
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Join the Islamic Ethics Intensive – A 3-day journey to strengthen your character and faith.
        </p>

        {/* Event Highlights */}
        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-700 mb-6">
          <span className="bg-gray-100 px-3 py-1 rounded-full shadow">📅 11–13 July 2024</span>
          <span className="bg-gray-100 px-3 py-1 rounded-full shadow">⏰ 1hr 15min/day</span>
          <span className="bg-gray-100 px-3 py-1 rounded-full shadow">🌐 Online</span>
          <span className="bg-gray-100 px-3 py-1 rounded-full shadow">👥 Limited Seats</span>
        </div>

        {/* Alert */}
        <p className="text-yellow-700 font-medium text-center mb-6">
          ⚠️ Only 50 boys and 50 girls can join — first-come, first-served.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              required
              name="fullName"
              placeholder="Full Name"
              className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <input
              required
              name="age"
              placeholder="Age"
              className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <input
              required
              name="email"
              type="email"
              placeholder="Email Address"
              className="md:col-span-2 border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <input
              required
              name="phone"
              placeholder="Phone Number"
              className="md:col-span-2 border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block font-medium mb-1">Gender</label>
            <div className="flex gap-6 text-sm">
              <label className="flex items-center gap-2">
                <input type="radio" name="gender" value="Male" required />
                Male
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="gender" value="Female" required />
                Female
              </label>
            </div>
          </div>

          {/* Communication */}
          <div>
            <label className="block font-medium mb-1">Preferred Communication Methods</label>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {['Email', 'SMS', 'WhatsApp', 'Phone'].map((method) => (
                <label key={method} className="flex items-center gap-2">
                  <input type="checkbox" name="communication" value={method} />
                  {method}
                </label>
              ))}
            </div>
          </div>

          {/* Message */}
          <textarea
            name="additionalInfo"
            placeholder="Additional Information (Optional)"
            className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none resize-none h-24"
          ></textarea>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition hover:scale-[1.01]"
          >
            Register Now
          </button>
        </form>

        {/* Note */}
        <p className="mt-6 text-xs text-center text-gray-500 max-w-xl mx-auto leading-relaxed">
          <strong>Note:</strong> By registering, you commit to attending all three days of the program.
          You will receive joining instructions via your selected communication method 24 hours before the course begins.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
