import { z } from 'zod';

const bodySchema = z.object({
  nome: z.string({ required_error: 'Nome é obrigatório' }).min(3, 'O campo nome deve ter entre 3 e 255 caracteres').max(255),
  sobrenome: z.string({ required_error: 'Sobrenome é obrigatório' }).min(3, 'O campo sobrenome deve ter entre 3 e 255 caracteres').max(255),
  email: z.string({ required_error: 'Email é obrigatório' }).email('Email inválido'),
  idade: z.number().int('Idade precisa ser um número inteiro').min(0, 'Idade não pode ser negativa').max(100, 'Idade não pode ser maior que 100')
    .optional(),
  nota1: z.number().min(0, 'Nota não pode ser menor que 0').max(10, 'Nota não pode ser maior que 10').optional(),
  nota2: z.number().min(0).max(10).optional(),
  nota3: z.number().min(0).max(10).optional(),
  faltas: z.number().int().min(0).optional(),
});

export const alunoStoreSchema = z.object({
  body: bodySchema,
});

export const alunoUpdateSchema = z.object({
  body: bodySchema.partial(),
});
