import { z } from 'zod';

const publicBodySchema = z.object({
  nome: z.string({ required_error: 'Nome é obrigatório' }).min(3, 'Nome deve ter pelo menos 3 caracteres').max(255),
  email: z.string({ required_error: 'Email é obrigatório' }).email('Email inválido'),
  password: z.string({ required_error: 'Senha é obrigatória' }).min(6, 'A senha precisa ter entre 6 e 50 caracteres').max(50),
}).strict('Não é permitido alterar perfil ou vínculo de aluno por esta rota.');

const adminBodySchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(255).optional(),
  email: z.string().email('Email inválido').optional(),
  password: z.string().min(6, 'A senha precisa ter entre 6 e 50 caracteres').max(50).optional(),
  perfil: z.enum(['ADMIN', 'PROFESSOR', 'ALUNO']).optional(),
  aluno_id: z.number().int().nullable().optional(),
});

export const userStoreSchema = z.object({
  body: publicBodySchema,
});

export const userUpdateSchema = z.object({
  body: publicBodySchema.partial(),
});

export const userAdminUpdateSchema = z.object({
  body: adminBodySchema,
});
