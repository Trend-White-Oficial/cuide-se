// Especialidades disponíveis
export const SPECIALTIES = [
  'Cabeleireira',
  'Manicure',
  'Podóloga',
  'Esteticista',
  'Maquiadora',
  'Designer de Sobrancelhas',
  'Barbeira',
  'Massoterapeuta',
] as const;

// Estados brasileiros
export const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const;

// Dias da semana
export const WEEKDAYS = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado'
] as const;

// Horários de funcionamento
export const BUSINESS_HOURS = {
  start: '08:00',
  end: '18:00',
} as const;

// Status de agendamento
export const SCHEDULING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const;

// Configurações de paginação
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50,
} as const;

// Configurações de avaliação
export const RATING = {
  MIN: 1,
  MAX: 5,
  STEP: 1,
} as const;

// Configurações de cache
export const CACHE = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
} as const;

// Configurações de rota
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  SEARCH: '/search',
  PROFESSIONAL: (id: string) => `/professional/${id}`,
  NOT_FOUND: '*',
} as const;

// Configurações de API
export const API = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

// Configurações de validação
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 3,
  PHONE_REGEX: /^\(\d{2}\) \d{4,5}-\d{4}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  CEP_REGEX: /^\d{5}-\d{3}$/,
} as const;

// Configurações de upload
export const UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_FILES: 5,
} as const;

// Configurações de notificação
export const NOTIFICATION = {
  DURATION: 5000,
  POSITION: 'top-right',
} as const;

export const APP_NAME = 'Cuide-Se';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  PROFESSIONALS: {
    BASE: '/professionals',
    SERVICES: (id: string) => `/professionals/${id}/services`,
    REVIEWS: (id: string) => `/professionals/${id}/reviews`,
  },
  SCHEDULING: {
    BASE: '/scheduling',
    USER: '/scheduling/user',
    PROFESSIONAL: '/scheduling/professional',
    CANCEL: (id: string) => `/scheduling/${id}/cancel`,
  },
  REVIEWS: {
    BASE: '/reviews',
    PROFESSIONAL: (id: string) => `/reviews/professional/${id}`,
    USER: '/reviews/user',
  },
} as const;

export const USER_ROLES = {
  USER: 'user',
  PROFESSIONAL: 'professional',
} as const;

export const CACHE_TIME = {
  STALE_TIME: 1000 * 60 * 5, // 5 minutos
  GC_TIME: 1000 * 60 * 30, // 30 minutos
} as const;

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
} as const; 