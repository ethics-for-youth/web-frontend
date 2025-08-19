// Environment detection utilities

export const getEnvironment = (): string => {
  // Check for explicit environment variable
  if (import.meta.env.VITE_ENVIRONMENT) {
    return import.meta.env.VITE_ENVIRONMENT;
  }
  
  // Check for development mode
  if (import.meta.env.DEV) {
    return 'development';
  }
  
  // Check API URL to determine environment
  const apiUrl = import.meta.env.VITE_API_BASE_URL || '';
  
  if (apiUrl.includes('dev.efy.org.in')) {
    return 'development';
  }
  
  if (apiUrl.includes('qa.efy.org.in') || apiUrl.includes('staging.efy.org.in')) {
    return 'qa';
  }
  
  // Default to production
  return 'production';
};

export const isDevelopment = (): boolean => {
  return getEnvironment() === 'development';
};

export const isQA = (): boolean => {
  return getEnvironment() === 'qa';
};

export const isTestingEnvironment = (): boolean => {
  const env = getEnvironment();
  return env === 'development' || env === 'qa';
};

export const getEnvironmentDisplayName = (): string => {
  const env = getEnvironment();
  switch (env) {
    case 'development':
      return 'DEVELOPMENT';
    case 'qa':
      return 'DEMO SITE';
    default:
      return '';
  }
};

export const getEnvironmentColor = (): string => {
  const env = getEnvironment();
  switch (env) {
    case 'development':
      return 'bg-yellow-500';
    case 'qa':
      return 'bg-orange-500';
    default:
      return '';
  }
};
