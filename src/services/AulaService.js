import Aula from '../models/Aula';
import Turma from '../models/Turma';
import PeriodoLetivo from '../models/PeriodoLetivo';
import Frequencia from '../models/Frequencia';
import AppError from '../errors/AppError';

class AulaService {
  async index(turma_id, user = null) {
    if (user && user.perfil === 'PROFESSOR') {
      const turma = await Turma.findByPk(turma_id);
      if (turma && Number(turma.professor_id) !== Number(user.id)) {
        throw new AppError('Você não leciona nesta turma.', 403, 'PROIBIDO');
      }
    }
    return await Aula.findAll({
      where: { turma_id },
      include: [Frequencia],
      order: [['data', 'DESC']],
    });
  }

  async store(data, user = null) {
    const turma = await Turma.findByPk(data.turma_id, { include: [PeriodoLetivo] });
    if (!turma) throw new AppError('Turma não encontrada', 404, 'NAO_ENCONTRADO');
    if (user && user.perfil === 'PROFESSOR' && Number(turma.professor_id) !== Number(user.id)) {
      throw new AppError('Você não leciona nesta turma.', 403, 'PROIBIDO');
    }
    if (turma.PeriodoLetivo && turma.PeriodoLetivo.status === 'FECHADO') {
      throw new AppError('Período letivo fechado.', 403, 'PERIODO_FECHADO');
    }

    const existingAula = await Aula.findOne({
      where: {
        turma_id: data.turma_id,
        data: data.data,
      },
    });
    if (existingAula) {
      throw new AppError('Já existe uma aula/chamada registrada para esta turma nesta data.', 400, 'CHAMADA_JA_REGISTRADA');
    }

    try {
      return await Aula.create(data);
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        throw new AppError('Já existe uma aula/chamada registrada para esta turma nesta data.', 400, 'CHAMADA_JA_REGISTRADA');
      }
      throw err;
    }
  }
}
export default new AulaService();
