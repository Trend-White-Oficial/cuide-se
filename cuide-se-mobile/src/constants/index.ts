// Categorias de serviços
export const SERVICE_CATEGORIES = [
  'Cabelo',
  'Unhas',
  'Maquiagem',
  'Depilação',
  'Massagem',
  'Estética Facial',
  'Estética Corporal',
  'Sobrancelhas',
  'Cílios',
  'Spa',
] as const;

// Status de agendamento
export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Status de pagamento
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  REFUNDED: 'refunded',
} as const;

// Métodos de pagamento
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PIX: 'pix',
  BANK_TRANSFER: 'bank_transfer',
} as const;

// Tipos de notificação
export const NOTIFICATION_TYPES = {
  APPOINTMENT: 'appointment',
  MESSAGE: 'message',
  PAYMENT: 'payment',
  SYSTEM: 'system',
} as const;

// Papéis de usuário
export const USER_ROLES = {
  CLIENT: 'client',
  PROFESSIONAL: 'professional',
} as const;

// Dias da semana
export const WEEK_DAYS = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
] as const;

// Horários disponíveis
export const AVAILABLE_HOURS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
] as const;

// Duração padrão dos serviços (em minutos)
export const DEFAULT_SERVICE_DURATIONS = {
  QUICK: 30,
  SHORT: 60,
  MEDIUM: 90,
  LONG: 120,
  EXTENDED: 180,
} as const;

// Limites e restrições
export const LIMITS = {
  MAX_SERVICES_PER_PROFESSIONAL: 20,
  MAX_APPOINTMENTS_PER_DAY: 10,
  MAX_PORTFOLIO_IMAGES: 10,
  MIN_PASSWORD_LENGTH: 6,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_REVIEW_LENGTH: 1000,
} as const;

// Mensagens de erro
export const ERROR_MESSAGES = {
  INVALID_EMAIL: 'E-mail inválido',
  INVALID_PASSWORD: 'Senha deve ter no mínimo 6 caracteres',
  INVALID_PHONE: 'Telefone inválido',
  INVALID_CPF: 'CPF inválido',
  REQUIRED_FIELD: 'Campo obrigatório',
  PASSWORDS_DONT_MATCH: 'As senhas não coincidem',
  NETWORK_ERROR: 'Erro de conexão',
  SERVER_ERROR: 'Erro no servidor',
  UNAUTHORIZED: 'Não autorizado',
  NOT_FOUND: 'Não encontrado',
} as const;

// Mensagens de sucesso
export const SUCCESS_MESSAGES = {
  APPOINTMENT_CREATED: 'Agendamento realizado com sucesso',
  APPOINTMENT_CANCELLED: 'Agendamento cancelado com sucesso',
  PROFILE_UPDATED: 'Perfil atualizado com sucesso',
  REVIEW_CREATED: 'Avaliação enviada com sucesso',
  PASSWORD_CHANGED: 'Senha alterada com sucesso',
} as const;

// Configurações de cache
export const CACHE_CONFIG = {
  PROFESSIONALS: {
    staleTime: 1000 * 60 * 5, // 5 minutos
    cacheTime: 1000 * 60 * 30, // 30 minutos
  },
  SERVICES: {
    staleTime: 1000 * 60 * 10, // 10 minutos
    cacheTime: 1000 * 60 * 60, // 1 hora
  },
  APPOINTMENTS: {
    staleTime: 1000 * 30, // 30 segundos
    cacheTime: 1000 * 60 * 5, // 5 minutos
  },
} as const;

// Configurações de paginação
export const PAGINATION = {
  ITEMS_PER_PAGE: 10,
  MAX_PAGES: 100,
} as const; 