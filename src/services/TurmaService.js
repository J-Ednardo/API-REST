import Turma from '../models/Turma';
import PeriodoLetivo from '../models/PeriodoLetivo';
import Disciplina from '../models/Disciplina';
import AppError from '../errors/AppError';

class TurmaService {
  async index() {
    return await Turma.findAll({
      include: [PeriodoLetivo, Disciplina],
    });
  }

  async show(id) {
    return await Turma.findByPk(id, {
      include: [PeriodoLetivo, Disciplina],
    });
  }

  async store(data) {
    if (data.periodo_id) {
      const periodo = await PeriodoLetivo.findByPk(data.periodo_id);
      if (periodo && periodo.status === 'FECHADO') {
        throw new AppError('Não é possível realizar alterações em uma turma de período letivo fechado.', 403, 'PERIODO_FECHADO');
      }
    }
    return await Turma.create(data);
  }

  async update(id, data) {
    const turma = await Turma.findByPk(id, {
      include: [PeriodoLetivo],
    });
    if (!turma) throw new AppError('Turma não encontrada', 404, 'NAO_ENCONTRADO');

    if (turma.PeriodoLetivo && turma.PeriodoLetivo.status === 'FECHADO') {
      throw new AppError('Não é possível realizar alterações em uma turma de período letivo fechado.', 403, 'PERIODO_FECHADO');
    }

    if (data.periodo_id) {
      const novoPeriodo = await PeriodoLetivo.findByPk(data.periodo_id);
      if (novoPeriodo && novoPeriodo.status === 'FECHADO') {
        throw new AppError('Não é possível realizar alterações em uma turma de período letivo fechado.', 403, 'PERIODO_FECHADO');
      }
    }

    return await turma.update(data);
  }

  async delete(id) {
    const turma = await Turma.findByPk(id, {
      include: [PeriodoLetivo],
    });
    if (!turma) throw new AppError('Turma não encontrada', 404, 'NAO_ENCONTRADO');

    if (turma.PeriodoLetivo && turma.PeriodoLetivo.status === 'FECHADO') {
      throw new AppError('Não é possível realizar alterações em uma turma de período letivo fechado.', 403, 'PERIODO_FECHADO');
    }

    await turma.destroy();
  }
}

export default new TurmaService();
