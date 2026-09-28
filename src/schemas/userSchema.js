import { z } from 'zod';

const bodySchema = z.object({
  nome: z.string({ required_error: 'Nome é obrigatório' }).min(3, 'Nome deve ter pelo menos 3 caracteres').max(255),
  email: z.string({ required_error: 'Email é obrigatório' }).email('Email inválido'),
  password: z.string({ required_error: 'Senha é obrigatória' }).min(6, 'A senha precisa ter entre 6 e 50 caracteres').max(50)
});

export const userStoreSchema = z.object({
  body: bodySchema
});

export const userUpdateSchema = z.object({
  body: bodySchema.partial()
});
