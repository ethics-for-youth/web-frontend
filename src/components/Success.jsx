import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ApplicationSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-100 px-4 py-10">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-lg w-full">
        <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Registration Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for registering. We've received your application and will be in touch shortly.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
