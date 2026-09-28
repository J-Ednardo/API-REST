import PeriodoLetivo from '../models/PeriodoLetivo';

class PeriodoLetivoService {
  async index() {
    return await PeriodoLetivo.findAll();
  }
  async show(id) {
    return await PeriodoLetivo.findByPk(id);
  }
  async store(data) {
    return await PeriodoLetivo.create(data);
  }
  async update(id, data) {
    const periodo = await PeriodoLetivo.findByPk(id);
    if (!periodo) throw new Error('Período letivo não encontrado');
    return await periodo.update(data);
  }
  async delete(id) {
    const periodo = await PeriodoLetivo.findByPk(id);
    if (!periodo) throw new Error('Período letivo não encontrado');
    await periodo.destroy();
  }
}

export default new PeriodoLetivoService();
