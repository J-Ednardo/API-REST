import { ZodError } from 'zod';
import AppError from '../errors/AppError';

export default (err, req, res, next) => {
  if (err instanceof ZodError) {
    const detalhes = err.issues.map((issue) => ({
      campo: issue.path.join('.'),
      mensagem: issue.message,
    }));

    return res.status(400).json({
      erro: {
        codigo: 'VALIDACAO',
        mensagem: 'Dados inválidos.',
        detalhes,
      },
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      erro: {
        codigo: err.codigo,
        mensagem: err.mensagem,
        detalhes: err.detalhes,
      },
    });
  }

  // Erros do Sequelize (ex: validação do Model ou violação de unicidade)
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const detalhes = err.errors.map((e) => ({
      campo: e.path,
      mensagem: e.message,
    }));
    return res.status(400).json({
      erro: {
        codigo: 'VALIDACAO_DB',
        mensagem: 'Erro de validação no banco de dados.',
        detalhes,
      },
    });
  }

  console.error(err);

  return res.status(500).json({
    erro: {
      codigo: 'ERRO_INTERNO',
      mensagem: 'Erro interno do servidor.',
      detalhes: [],
    },
  });
};
