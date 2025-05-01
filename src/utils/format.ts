import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (date: string | Date) => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

export const formatTime = (time: string) => {
  return format(parseISO(`2000-01-01T${time}`), 'HH:mm');
};

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

export const formatPhoneNumber = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

export const formatAddress = (address: {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}) => {
  const { street, number, complement, neighborhood, city, state, zipCode } = address;
  const complementText = complement ? `, ${complement}` : '';
  return `${street}, ${number}${complementText} - ${neighborhood}, ${city}/${state} - CEP: ${zipCode}`;
}; 