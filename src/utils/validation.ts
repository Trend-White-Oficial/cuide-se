import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export const registerSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  phone: z.string().optional(),
  role: z.enum(['user', 'professional'], {
    errorMap: () => ({ message: 'Tipo de usuário inválido' }),
  }),
});

export const professionalSchema = z.object({
  specialties: z.array(z.string()).min(1, 'Selecione pelo menos uma especialidade'),
  description: z.string().min(50, 'A descrição deve ter no mínimo 50 caracteres'),
  experience: z.number().min(0, 'A experiência deve ser um número positivo'),
  address: z.object({
    street: z.string().min(3, 'Rua inválida'),
    number: z.string().min(1, 'Número inválido'),
    complement: z.string().optional(),
    neighborhood: z.string().min(3, 'Bairro inválido'),
    city: z.string().min(3, 'Cidade inválida'),
    state: z.string().length(2, 'Estado inválido'),
    zipCode: z.string().length(8, 'CEP inválido'),
  }),
  workingHours: z.record(
    z.string(),
    z.object({
      start: z.string(),
      end: z.string(),
    })
  ),
});

export const serviceSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  description: z.string().min(50, 'A descrição deve ter no mínimo 50 caracteres'),
  duration: z.number().min(15, 'A duração deve ser de no mínimo 15 minutos'),
  price: z.number().min(0, 'O preço deve ser um número positivo'),
  category: z.string().min(3, 'Categoria inválida'),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'O comentário deve ter no mínimo 10 caracteres'),
  serviceId: z.string().uuid('ID do serviço inválido'),
});

export const schedulingSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'),
  serviceId: z.string().uuid('ID do serviço inválido'),
  professionalId: z.string().uuid('ID do profissional inválido'),
}); 