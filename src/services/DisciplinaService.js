import Disciplina from '../models/Disciplina';

class DisciplinaService {
  async index() {
    return await Disciplina.findAll();
  }
  async show(id) {
    return await Disciplina.findByPk(id);
  }
  async store(data) {
    return await Disciplina.create(data);
  }
  async update(id, data) {
    const disciplina = await Disciplina.findByPk(id);
    if (!disciplina) throw new Error('Disciplina não encontrada');
    return await disciplina.update(data);
  }
  async delete(id) {
    const disciplina = await Disciplina.findByPk(id);
    if (!disciplina) throw new Error('Disciplina não encontrada');
    await disciplina.destroy();
  }
}

export default new DisciplinaService();
