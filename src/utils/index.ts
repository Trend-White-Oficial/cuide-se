import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Formatação de data
export const formatDate = (date: string | Date, formatStr = 'dd/MM/yyyy') => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, formatStr, { locale: ptBR });
};

// Formatação de hora
export const formatTime = (time: string) => {
  return time.substring(0, 5);
};

// Formatação de preço
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

// Formatação de telefone
export const formatPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

// Formatação de CEP
export const formatCEP = (cep: string) => {
  const cleaned = cep.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{5})(\d{3})$/);
  if (match) {
    return `${match[1]}-${match[2]}`;
  }
  return cep;
};

// Validação de email
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validação de senha
export const isValidPassword = (password: string) => {
  return password.length >= 8;
};

// Validação de telefone
export const isValidPhone = (phone: string) => {
  const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
  return phoneRegex.test(phone);
};

// Validação de CEP
export const isValidCEP = (cep: string) => {
  const cepRegex = /^\d{5}-\d{3}$/;
  return cepRegex.test(cep);
};

// Truncamento de texto
export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Geração de slug
export const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

// Cálculo de média de avaliações
export const calculateAverageRating = (ratings: number[]) => {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return sum / ratings.length;
};

// Formatação de duração
export const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${minutes} min`;
  }
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h${remainingMinutes}min`;
};

// Verificação de disponibilidade
export const isTimeSlotAvailable = (
  time: string,
  bookedSlots: string[],
  businessHours: { start: string; end: string }
) => {
  const [start, end] = [businessHours.start, businessHours.end].map(time => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  });

  const timeMinutes = time.split(':').reduce((acc, val) => acc * 60 + Number(val), 0);
  
  return (
    timeMinutes >= start &&
    timeMinutes <= end &&
    !bookedSlots.includes(time)
  );
};

// Ordenação de profissionais
export const sortProfessionals = (
  professionals: any[],
  sortBy: 'rating' | 'price' | 'distance',
  order: 'asc' | 'desc' = 'desc'
) => {
  return [...professionals].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'rating':
        comparison = a.rating - b.rating;
        break;
      case 'price':
        comparison = a.services[0]?.price - b.services[0]?.price;
        break;
      case 'distance':
        comparison = a.distance - b.distance;
        break;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
}; 