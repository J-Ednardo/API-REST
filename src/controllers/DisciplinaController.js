import DisciplinaService from '../services/DisciplinaService';

class DisciplinaController {
  async index(req, res, next) {
    try {
      const data = await DisciplinaService.index();
      res.json(data);
    } catch (e) { next(e); }
  }
  async show(req, res, next) {
    try {
      const data = await DisciplinaService.show(req.params.id);
      res.json(data);
    } catch (e) { next(e); }
  }
  async store(req, res, next) {
    try {
      const data = await DisciplinaService.store(req.body);
      res.status(201).json(data);
    } catch (e) { next(e); }
  }
  async update(req, res, next) {
    try {
      const data = await DisciplinaService.update(req.params.id, req.body);
      res.json(data);
    } catch (e) { next(e); }
  }
  async delete(req, res, next) {
    try {
      await DisciplinaService.delete(req.params.id);
      res.status(204).send();
    } catch (e) { next(e); }
  }
}
export default new DisciplinaController();
