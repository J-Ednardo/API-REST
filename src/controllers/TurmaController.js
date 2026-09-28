import TurmaService from '../services/TurmaService';

class TurmaController {
  async index(req, res, next) {
    try {
      const data = await TurmaService.index();
      res.json(data);
    } catch (e) { next(e); }
  }
  async show(req, res, next) {
    try {
      const data = await TurmaService.show(req.params.id);
      res.json(data);
    } catch (e) { next(e); }
  }
  async store(req, res, next) {
    try {
      const data = await TurmaService.store(req.body);
      res.status(201).json(data);
    } catch (e) { next(e); }
  }
  async update(req, res, next) {
    try {
      const data = await TurmaService.update(req.params.id, req.body);
      res.json(data);
    } catch (e) { next(e); }
  }
  async delete(req, res, next) {
    try {
      await TurmaService.delete(req.params.id);
      res.status(204).send();
    } catch (e) { next(e); }
  }
}
export default new TurmaController();
