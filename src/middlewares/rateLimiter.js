import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Limita cada IP a 5 requests por windowMs
  handler: (req, res, next) => res.status(429).json({
    erro: {
      codigo: 'MUITAS_REQUISICOES',
      mensagem: 'Muitas tentativas de login. Tente novamente mais tarde.',
    },
  }),
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // Limita cada IP a 3 contas por hora
  handler: (req, res, next) => res.status(429).json({
    erro: {
      codigo: 'MUITAS_REQUISICOES',
      mensagem: 'Muitas contas criadas. Tente novamente mais tarde.',
    },
  }),
});
