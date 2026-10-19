import Turma from '../models/Turma';
import PeriodoLetivo from '../models/PeriodoLetivo';
import Disciplina from '../models/Disciplina';
import User from '../models/User';
import AppError from '../errors/AppError';

class TurmaService {
  async index(user = null) {
    const where = {};
    if (user && user.perfil === 'PROFESSOR') {
      where.professor_id = user.id;
    }

    return await Turma.findAll({
      where,
      include: [
        PeriodoLetivo,
        Disciplina,
        { model: User, as: 'Professor', attributes: ['id', 'nome', 'email'] },
      ],
    });
  }

  async show(id, user = null) {
    const turma = await Turma.findByPk(id, {
      include: [
        PeriodoLetivo,
        Disciplina,
        { model: User, as: 'Professor', attributes: ['id', 'nome', 'email'] },
      ],
    });

    if (turma && user && user.perfil === 'PROFESSOR' && Number(turma.professor_id) !== Number(user.id)) {
      throw new AppError('Você não tem permissão para acessar esta turma.', 403, 'PROIBIDO');
    }

    return turma;
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
