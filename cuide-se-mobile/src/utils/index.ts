import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Formatação de data e hora
export const formatDate = (date: string | Date) => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'dd/MM/yyyy', { locale: ptBR });
};

export const formatTime = (time: string) => {
  return format(parseISO(`2000-01-01T${time}`), 'HH:mm');
};

export const formatDateTime = (date: string | Date) => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
};

// Formatação de moeda
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Validação de e-mail
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validação de telefone
export const isValidPhone = (phone: string) => {
  const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
  return phoneRegex.test(phone);
};

// Formatação de telefone
export const formatPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

// Cálculo de média de avaliações
export const calculateAverageRating = (ratings: number[]) => {
  if (!ratings.length) return 0;
  const sum = ratings.reduce((acc, curr) => acc + curr, 0);
  return Number((sum / ratings.length).toFixed(1));
};

// Ordenação de arrays
export const sortByDate = <T extends { createdAt: string }>(
  array: T[],
  ascending = false
) => {
  return [...array].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

export const sortByRating = <T extends { rating: number }>(
  array: T[],
  ascending = false
) => {
  return [...array].sort((a, b) => {
    return ascending ? a.rating - b.rating : b.rating - a.rating;
  });
};

export const sortByPrice = <T extends { price: number }>(
  array: T[],
  ascending = true
) => {
  return [...array].sort((a, b) => {
    return ascending ? a.price - b.price : b.price - a.price;
  });
};

// Geração de ID único
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Truncamento de texto
export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

// Validação de senha
export const isValidPassword = (password: string) => {
  // Mínimo 6 caracteres, pelo menos uma letra e um número
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  return passwordRegex.test(password);
};

// Validação de CPF
export const isValidCPF = (cpf: string) => {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;

  let sum = 0;
  let rest;

  if (cleaned === '00000000000') return false;

  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(cleaned.substring(i - 1, i)) * (11 - i);
  }

  rest = (sum * 10) % 11;

  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cleaned.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(cleaned.substring(i - 1, i)) * (12 - i);
  }

  rest = (sum * 10) % 11;

  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cleaned.substring(10, 11))) return false;

  return true;
};

// Formatação de CPF
export const formatCPF = (cpf: string) => {
  const cleaned = cpf.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
  }
  return cpf;
}; 