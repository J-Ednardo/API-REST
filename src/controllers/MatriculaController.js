import MatriculaService from '../services/MatriculaService';
import AppError from '../errors/AppError';

class MatriculaController {
  async index(req, res, next) {
    try {
      const aluno_id = req.user.perfil === 'ALUNO' ? req.user.aluno_id : null;
      const data = await MatriculaService.index(aluno_id);
      res.json(data);
    } catch (e) { next(e); }
  }

  async show(req, res, next) {
    try {
      const aluno_id = req.user.perfil === 'ALUNO' ? req.user.aluno_id : null;
      const data = await MatriculaService.show(req.params.id, aluno_id);
      if (!data) throw new AppError('Matrícula não encontrada', 404, 'NAO_ENCONTRADO');
      res.json(data);
    } catch (e) { next(e); }
  }

  async store(req, res, next) {
    try {
      const data = await MatriculaService.store(req.body);
      res.status(201).json(data);
    } catch (e) { next(e); }
  }

  async update(req, res, next) {
    try {
      const data = await MatriculaService.update(req.params.id, req.body);
      res.json(data);
    } catch (e) { next(e); }
  }

  async delete(req, res, next) {
    try {
      await MatriculaService.delete(req.params.id);
      res.status(204).send();
    } catch (e) { next(e); }
  }
}
export default new MatriculaController();
