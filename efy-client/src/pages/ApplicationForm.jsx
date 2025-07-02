import React, { useState } from 'react';
import EventDetails from '../components/EventDetails';
import scannerImg from '../assets/scanner.jpeg'; 

export default function StudentRegistrationForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    email: '',
    whatsappNumber: '',
    gender: '',
    age: '',
    education: '',
    existingStudent: '',
    paymentScreenshot: null,
    reason: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, paymentScreenshot: e.target.files[0] }));
  };

  const handleGenderSelect = (gender) => {
    setFormData((prev) => ({ ...prev, gender }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { fullName, fatherName, email, whatsappNumber, gender, education, paymentScreenshot } = formData;
    if (!fullName || !fatherName || !email || !whatsappNumber || !gender || !education || !paymentScreenshot) {
      alert("Please fill out all mandatory fields.");
      return;
    }
    console.log('Submitted Data:', formData);
    alert("Form submitted successfully!");
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      fatherName: '',
      email: '',
      whatsappNumber: '',
      gender: '',
      age: '',
      education: '',
      existingStudent: '',
      paymentScreenshot: null,
      reason: '',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Left Illustration Section */}
        <div>
          <EventDetails />
        </div>

        {/* Right Form Section */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Father's Name *</label>
            <input
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter father's name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email ID *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number [WhatsApp] *</label>
            <input
              type="tel"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => handleGenderSelect('Male')}
                className={`px-4 py-2 rounded-lg border w-full transition ${formData.gender === 'Male' ? 'bg-gray-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => handleGenderSelect('Female')}
                className={`px-4 py-2 rounded-lg border w-full transition ${formData.gender === 'Female' ? 'bg-gray-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                Female
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Education Qualification or Pursuing *</label>
            <input
              type="text"
              name="education"
              value={formData.education}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
              placeholder="Qualification"
              required
            />
          </div>

          {/* Scanner Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Scan to Pay</label>
            <img src={scannerImg} alt="Scanner QR" className="w-full max-w-xs mx-auto rounded-md shadow" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Screenshot *</label>
            <input
              type="file"
              name="paymentScreenshot"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg bg-white"
              required
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2 border border-gray-400 text-gray-600 rounded-lg hover:bg-gray-100"
            >
              Reset Form
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow"
            >
              Register Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
