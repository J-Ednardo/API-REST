import { z } from 'zod';

export const fotoSchema = z.object({
  body: z.object({
    aluno_id: z.string({ required_error: 'Falta o id do aluno' })
      .or(z.number({ required_error: 'Falta o id do aluno' })),
  }),
});
