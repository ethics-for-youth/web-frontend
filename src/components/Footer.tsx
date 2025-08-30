import { Link } from 'react-router-dom';
import { Heart, Mail, MessageCircle, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">EFY</span>
              </div>
              <span className="font-bold text-xl">Ethics For Youth</span>
            </div>
            <p className="text-primary-foreground/80 mb-4 max-w-md">
              Empowering young Muslims with knowledge, ethics, and community engagement 
              rooted in Islamic values. Building character for a better tomorrow.
            </p>
            <div className="flex items-center space-x-1 text-sm text-primary-foreground/70">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-400" />
              <span>for the Muslim community</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/volunteer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Volunteer
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Connect With Us</h3>
            <div className="space-y-3">
              <a 
                href="mailto:ethicsforyouth@gmail.com" 
                className="flex items-center space-x-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <div className="p-2 bg-primary-foreground/10 rounded-lg">
                  <Mail className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-sm">Email</span>
              </a>
              <a 
                href="https://wa.me/919214808891" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <div className="p-2 bg-primary-foreground/10 rounded-lg">
                  <MessageCircle className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-sm">WhatsApp</span>
              </a>
              <a 
                href="https://instagram.com/ethicsforyouth" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <div className="p-2 bg-primary-foreground/10 rounded-lg">
                  <Instagram className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-sm">Instagram</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/70">
          <p>&copy; 2025 Ethics For Youth. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;