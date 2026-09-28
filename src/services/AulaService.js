import Aula from '../models/Aula';
import Turma from '../models/Turma';
import PeriodoLetivo from '../models/PeriodoLetivo';
import AppError from '../errors/AppError';

class AulaService {
  async index(turma_id) {
    return await Aula.findAll({ where: { turma_id } });
  }

  async store(data) {
    const turma = await Turma.findByPk(data.turma_id, { include: [PeriodoLetivo] });
    if (!turma) throw new AppError('Turma não encontrada', 404, 'NAO_ENCONTRADO');
    if (turma.PeriodoLetivo && turma.PeriodoLetivo.status === 'FECHADO') {
      throw new AppError('Período letivo fechado.', 403, 'PERIODO_FECHADO');
    }
    return await Aula.create(data);
  }
}
export default new AulaService();
