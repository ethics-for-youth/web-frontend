import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isTestingEnvironment } from '@/utils/environment';

interface Admin {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  admin: Admin | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock admin credentials - in production, this would be handled by a secure backend
const getMockAdmin = () => {
  if (isTestingEnvironment()) {
    return {
      id: '1',
      email: 'admin@ethicsforyouth.org',
      password: 'admin123',
      name: 'Admin User'
    };
  } else {
    return {
      id: '1',
      email: 'prod.admin@efy.org.in',
      password: 'prodAdmin@2025',
      name: 'Production Admin'
    };
  }
};

const MOCK_ADMIN = getMockAdmin();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on mount
    const storedAdmin = localStorage.getItem('efy_admin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in production, this would call a secure API
    if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
      const adminData = {
        id: MOCK_ADMIN.id,
        email: MOCK_ADMIN.email,
        name: MOCK_ADMIN.name
      };
      setAdmin(adminData);
      localStorage.setItem('efy_admin', JSON.stringify(adminData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('efy_admin');
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};