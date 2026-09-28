import Turma from '../models/Turma';

class TurmaService {
  async index() {
    return await Turma.findAll();
  }

  async show(id) {
    return await Turma.findByPk(id);
  }

  async store(data) {
    return await Turma.create(data);
  }

  async update(id, data) {
    const turma = await Turma.findByPk(id);
    if (!turma) throw new Error('Turma não encontrada');
    return await turma.update(data);
  }

  async delete(id) {
    const turma = await Turma.findByPk(id);
    if (!turma) throw new Error('Turma não encontrada');
    await turma.destroy();
  }
}

export default new TurmaService();
