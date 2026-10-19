import AulaService from '../services/AulaService';

class AulaController {
  async index(req, res, next) {
    try {
      const { turma_id } = req.params;
      const data = await AulaService.index(turma_id, req.user);
      res.json(data);
    } catch (e) { next(e); }
  }

  async store(req, res, next) {
    try {
      const { turma_id } = req.params;
      const data = await AulaService.store({ ...req.body, turma_id }, req.user);
      res.status(201).json(data);
    } catch (e) { next(e); }
  }
}
export default new AulaController();
