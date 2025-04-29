// Este arquivo contém funções utilitárias reutilizáveis em todo o projeto.
// Inclui validações, formatações e cálculos comuns.

import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Formatação de data e hora
// Converte uma string ou objeto Date para o formato 'dd/MM/yyyy'.
export const formatDate = (date: string | Date, formatStr = 'dd/MM/yyyy') => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, formatStr, { locale: ptBR });
};

// Formatação de hora
// Extrai os primeiros 5 caracteres de uma string de hora no formato 'HH:mm:ss'.
export const formatTime = (time: string) => {
  return time.substring(0, 5);
};

// Formatação de preço
// Converte um número para o formato de moeda brasileira (BRL).
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

// Formatação de telefone
// Formata uma string de telefone para o padrão '(XX) XXXXX-XXXX'.
export const formatPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

// Formatação de CEP
// Formata uma string de CEP para o padrão 'XXXXX-XXX'.
export const formatCEP = (cep: string) => {
  const cleaned = cep.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{5})(\d{3})$/);
  if (match) {
    return `${match[1]}-${match[2]}`;
  }
  return cep;
};

// Formatação de CPF
// Converte um CPF para o formato 'XXX.XXX.XXX-XX'.
export const formatCPF = (cpf: string) => {
  const cleaned = cpf.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
  }
  return cpf;
};

// Validação de e-mail
// Verifica se o e-mail fornecido está em um formato válido.
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validação de senha
// Verifica se a senha fornecida possui pelo menos 8 caracteres.
export const isValidPassword = (password: string) => {
  return password.length >= 8;
};

// Validação de telefone
// Verifica se o telefone fornecido está no formato '(XX) XXXXX-XXXX'.
export const isValidPhone = (phone: string) => {
  const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
  return phoneRegex.test(phone);
};

// Validação de CEP
// Verifica se o CEP fornecido está no formato 'XXXXX-XXX'.
export const isValidCEP = (cep: string) => {
  const cepRegex = /^\d{5}-\d{3}$/;
  return cepRegex.test(cep);
};

// Validação de CPF
// Verifica se o CPF fornecido é válido com base nos dígitos verificadores.
export const isValidCPF = (cpf: string) => {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;

  let sum = 0;
  let rest;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i);
  }

  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cleaned.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i);
  }

  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cleaned.substring(10, 11))) return false;

  return true;
};

// Truncamento de texto
// Trunca uma string para o comprimento máximo especificado e adiciona '...' no final.
export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Geração de slug
// Converte uma string para um formato de slug, removendo acentos e caracteres especiais.
export const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

// Cálculo de média de avaliações
// Calcula a média de um array de avaliações numéricas.
export const calculateAverageRating = (ratings: number[]) => {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return sum / ratings.length;
};

// Formatação de duração
// Converte uma duração em minutos para o formato 'XhYmin' ou 'Xh' ou 'Ymin'.
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
// Verifica se um horário está disponível com base nos horários reservados e no horário comercial.
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
// Ordena um array de profissionais com base em 'rating', 'price' ou 'distance', em ordem ascendente ou descendente.
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