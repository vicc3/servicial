// src/config/environment.ts
interface Environment {
    API_URL: string;
    FIREBASE_CONFIG: any;
    DEBUG: boolean;
    LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
    CACHE_TTL: number;
    MAX_FILE_SIZE: number;
  }
  
  const development: Environment = {
    API_URL: 'http://localhost:8080',
    FIREBASE_CONFIG: {
      // Configuración de desarrollo
    },
    DEBUG: true,
    LOG_LEVEL: 'debug',
    CACHE_TTL: 1 * 60 * 1000, // 1 minuto en desarrollo
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  };
  
  const production: Environment = {
    API_URL: 'https://api.tuapp.com',
    FIREBASE_CONFIG: {
      // Configuración de producción
    },
    DEBUG: false,
    LOG_LEVEL: 'error',
    CACHE_TTL: 30 * 60 * 1000, // 30 minutos en producción
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  };
  
  export const ENV = __DEV__ ? development : production;