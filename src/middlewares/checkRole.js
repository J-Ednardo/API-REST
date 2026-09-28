import AppError from '../errors/AppError';

export default function checkRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user || !req.user.perfil) {
      throw new AppError('Acesso negado. Perfil não encontrado.', 403, 'PROIBIDO');
    }

    if (allowedRoles.includes(req.user.perfil)) {
      return next();
    }

    // Regra especial: ALUNO pode acessar GET /alunos/:id apenas se for o próprio
    if (req.user.perfil === 'ALUNO') {
      if (req.method === 'GET' && req.params.id) {
        if (req.user.aluno_id && String(req.user.aluno_id) === String(req.params.id)) {
          return next();
        }
      }
    }

    throw new AppError('Você não tem permissão para acessar este recurso.', 403, 'PROIBIDO');
  };
}
