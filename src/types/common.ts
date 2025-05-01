// Tipos base para usuários do sistema
/**
 * Tipos de usuários no sistema
 * - client: Usuário comum que solicita serviços
 * - professional: Profissional que oferece serviços
 */
export type UserRole = 'client' | 'professional';

/**
 * Campos comuns para todos os tipos de usuários
 */
export interface BaseUser {
  id: string; // Identificador único do usuário
  name: string; // Nome completo do usuário
  email: string; // Email de contato
  phone?: string; // Telefone opcional
  avatar?: string; // URL da imagem do avatar
  role: UserRole; // Tipo de usuário
  createdAt: string; // Data de criação do registro
  updatedAt: string; // Data da última atualização
}

/**
 * Interface para usuários comuns (clientes)
 * Extende BaseUser sem campos adicionais específicos
 */
export interface User extends BaseUser {}

/**
 * Interface para profissionais
 * Extende BaseUser com campos específicos para profissionais
 */
export interface Professional extends BaseUser {
  specialty: string; // Especialidade do profissional
  bio: string; // Descrição biográfica
  portfolio: string[]; // Array de URLs para portfólio
  services: Service[]; // Lista de serviços oferecidos
  reviews: Review[]; // Lista de avaliações recebidas
  rating: number; // Avaliação média do profissional
  availability?: Availability[]; // Disponibilidade do profissional (opcional)
}

/**
 * Campos base para agendamentos
 */
export interface BaseAppointment {
  id: string; // Identificador único do agendamento
  clientId: string; // ID do cliente
  professionalId: string; // ID do profissional
  serviceId: string; // ID do serviço
  date: string; // Data do agendamento (formato ISO)
  time: string; // Horário do agendamento
}

/**
 * Interface completa para agendamentos
 * Extende BaseAppointment com status e pagamento
 */
export interface Appointment extends BaseAppointment {
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'; // Status do agendamento
  paymentStatus: 'pending' | 'paid' | 'refunded'; // Status do pagamento
}

/**
 * Interface para serviços oferecidos pelos profissionais
 */
export interface Service {
  id: string; // Identificador único do serviço
  name: string; // Nome do serviço
  description: string; // Descrição detalhada
  duration: number; // Duração em minutos
  price: number; // Preço do serviço
  category: string; // Categoria do serviço
  professionalId: string; // ID do profissional que oferece
}

/**
 * Interface para avaliações dos serviços
 */
export interface Review {
  id: string; // Identificador único da avaliação
  userId: string; // ID do usuário que avaliou
  professionalId: string; // ID do profissional avaliado
  rating: number; // Nota da avaliação (1-5)
  comment?: string; // Comentário opcional
  createdAt: string; // Data da avaliação
}

/**
 * Interface para disponibilidade dos profissionais
 */
export interface Availability {
  day: number; // Dia da semana (0-6)
  startTime: string; // Horário de início
  endTime: string; // Horário de término
  available: boolean; // Se está disponível nesse horário
}

/**
 * Interface para faixa de preços
 */
export interface PriceRange {
  min: number; // Preço mínimo
  max: number; // Preço máximo
}

/**
 * Interface para filtro de disponibilidade
 */
export interface AvailabilityFilter {
  date: string; // Data para filtro
  time: string; // Horário para filtro
}

/**
 * Interface para filtro de busca
 */
export interface Filter {
  specialty?: string; // Especialidade para filtro
  location?: string; // Localização para filtro
  priceRange?: PriceRange; // Faixa de preços para filtro
  rating?: number; // Avaliação para filtro
  availability?: AvailabilityFilter; // Disponibilidade para filtro
}
