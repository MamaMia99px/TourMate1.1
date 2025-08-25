// Environment Configuration Manager
// Security Note: For production, use environment variables instead of hardcoded values

const validateEnvironmentVariable = (key, defaultValue) => {
  const value = process.env[key];
  if (!value && process.env.EXPO_PUBLIC_APP_ENV === 'production') {
    console.warn(`Warning: Environment variable ${key} is not set in production`);
  }
  return value || defaultValue;
};

export const Environment = {
  // Firebase Configuration
  FIREBASE_CONFIG: {
    apiKey: validateEnvironmentVariable('EXPO_PUBLIC_FIREBASE_API_KEY', "AIzaSyAZSM44g_4krJ8zbeQMlwQJF7VvcDa09vM"),
    authDomain: validateEnvironmentVariable('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN', "tourismapp-82791.firebaseapp.com"),
    projectId: validateEnvironmentVariable('EXPO_PUBLIC_FIREBASE_PROJECT_ID', "tourismapp-82791"),
    storageBucket: validateEnvironmentVariable('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET', "tourismapp-82791.firebasestorage.app"),
    messagingSenderId: validateEnvironmentVariable('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', "830491999664"),
    appId: validateEnvironmentVariable('EXPO_PUBLIC_FIREBASE_APP_ID', "1:830491999664:web:38ff52fa6fe313be01aa75")
  },

  // App Environment
  APP_ENV: process.env.EXPO_PUBLIC_APP_ENV || 'development',
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.tourmate.app',
  
  // Feature Flags
  IS_DEVELOPMENT: (process.env.EXPO_PUBLIC_APP_ENV || 'development') === 'development',
  IS_STAGING: process.env.EXPO_PUBLIC_APP_ENV === 'staging',
  IS_PRODUCTION: process.env.EXPO_PUBLIC_APP_ENV === 'production',
  
  // Admin Configuration
  ADMIN_EMAILS: process.env.EXPO_PUBLIC_ADMIN_EMAILS?.split(',') || [
    'admin@touristapp.com',
    'superadmin@touristapp.com',
    'reports.admin@touristapp.com',
    'newadmin@touristapp.com'  // Add your new admin email here
  ],
  
  LGU_ADMIN_EMAILS: process.env.EXPO_PUBLIC_LGU_ADMIN_EMAILS?.split(',') || [
    'lgu.cebu@touristapp.com',
    'cebu.tourism@touristapp.com',
    'lgu.admin@touristapp.com',
    'tourism.officer@cebu.gov.ph',
    'content.manager@cebu.gov.ph',
    'new.lgu.admin@cebu.gov.ph'  // Add your new LGU admin email here
  ],

  // EAS Configuration
  EAS_PROJECT_ID: process.env.EXPO_PUBLIC_EAS_PROJECT_ID || null,

  // Debug Configuration
  ENABLE_FLIPPER: __DEV__ && process.env.EXPO_PUBLIC_APP_ENV !== 'production',
  ENABLE_LOGS: process.env.EXPO_PUBLIC_APP_ENV !== 'production',
  
  // Validation
  isConfigurationValid() {
    const requiredKeys = [
      'FIREBASE_CONFIG.apiKey',
      'FIREBASE_CONFIG.projectId',
      'FIREBASE_CONFIG.authDomain'
    ];
    
    for (const key of requiredKeys) {
      const keys = key.split('.');
      let value = this;
      for (const k of keys) {
        value = value[k];
        if (!value) {
          console.error(`Missing required configuration: ${key}`);
          return false;
        }
      }
    }
    return true;
  }
}; 