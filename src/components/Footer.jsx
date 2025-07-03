import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-green-900 text-white py-12 px-6 text-sm mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between gap-10">
        {/* Brand Info */}
        <div className="md:max-w-xs">
          <h5 className="text-lg font-semibold mb-2">Ethics for Youth</h5>
          <p className="text-gray-300 leading-relaxed">
            Empowering young Muslims with authentic Islamic knowledge and strong moral character.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h5 className="text-lg font-semibold mb-2">Quick Links</h5>
          <ul className="space-y-1 text-gray-300">
            <li className="hover:text-green-300 transition-colors cursor-pointer">Terms & Conditions</li>
            <li className="hover:text-green-300 transition-colors cursor-pointer">Privacy Policy</li>
            <li className="hover:text-green-300 transition-colors cursor-pointer">Contact Us!</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h5 className="text-lg font-semibold mb-2">Connect</h5>
          <ul className="space-y-1 text-gray-300">
            <li>Email: ethicsforyouth@gmail.com</li>
            <li>Phone: +91 8604615340</li>
            <li className="mt-2 flex gap-4 text-xl">
              <span className="hover:text-green-300 cursor-pointer">📘</span>
              <span className="hover:text-green-300 cursor-pointer">📷</span>
              <span className="hover:text-green-300 cursor-pointer">🎥</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="text-center text-xs text-gray-400 mt-10">
        © {new Date().getFullYear()} Ethics for Youth. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
