import FrequenciaService from '../services/FrequenciaService';

class FrequenciaController {
  async storeBatch(req, res, next) {
    try {
      const { aula_id } = req.params;
      // Espera req.body ser um array de { matricula_id, presente }
      const data = await FrequenciaService.storeBatch(aula_id, req.body);
      res.status(201).json(data);
    } catch (e) { next(e); }
  }

  async update(req, res, next) {
    try {
      const data = await FrequenciaService.update(req.params.id, req.body);
      res.json(data);
    } catch (e) { next(e); }
  }
}
export default new FrequenciaController();
