import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isTestingEnvironment, getEnvironmentDisplayName, getEnvironmentColor } from '@/utils/environment';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Courses', path: '/courses' },
    { name: 'Volunteer', path: '/volunteer' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/icon.png" alt="EFY Logo" className="w-9 h-9 object-contain" />

              <div className="w-full text-center pb-1">
                <span
                  className="text-lg sm:text-md md:text-xl lg:text-2xl font-bold -tracking-wide font-family: 'Nunito', sans-serif;
                bg-gradient-to-r from-[#4B703D] to-[#2E4A27]
                dark:from-[#F8FAFC] dark:to-[#94A3B8]
                bg-clip-text text-transparent"
                >
                  Ethics For Youth
                </span>
              </div>



            </Link>
            {/* Environment Indicator - Desktop Only */}
            {isTestingEnvironment() && (
              <div className={`hidden md:block ml-3 px-2 py-1 rounded text-xs font-bold text-white ${getEnvironmentColor()}`}>
                {getEnvironmentDisplayName()}
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.path)
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Environment Indicator for Mobile Only */}
            {isTestingEnvironment() && (
              <div className={`md:hidden px-2 py-1 rounded text-xs font-bold text-white ${getEnvironmentColor()}`}>
                {getEnvironmentDisplayName()}
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card border-t border-border">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive(link.path)
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;