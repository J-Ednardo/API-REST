import Frequencia from '../models/Frequencia';
import Aula from '../models/Aula';
import Turma from '../models/Turma';
import PeriodoLetivo from '../models/PeriodoLetivo';
import MatriculaService from './MatriculaService';
import AppError from '../errors/AppError';
import connection from '../database';

class FrequenciaService {
  async storeBatch(aula_id, frequenciasArray) {
    const aula = await Aula.findByPk(aula_id, { 
      include: [{ model: Turma, include: [PeriodoLetivo] }]
    });
    if (!aula) throw new AppError('Aula não encontrada', 404, 'NAO_ENCONTRADO');
    if (aula.Turma.PeriodoLetivo && aula.Turma.PeriodoLetivo.status === 'FECHADO') {
      throw new AppError('Período letivo fechado.', 403, 'PERIODO_FECHADO');
    }

    const t = await connection.transaction();
    try {
      const results = [];
      for (const item of frequenciasArray) {
        const freq = await Frequencia.create({
          aula_id,
          matricula_id: item.matricula_id,
          presente: item.presente
        }, { transaction: t });
        results.push(freq);
        
        // Recalcular matrícula
        await MatriculaService.update(item.matricula_id, {});
      }
      await t.commit();
      return results;
    } catch(err) {
      await t.rollback();
      throw err;
    }
  }

  async update(id, data) {
    const freq = await Frequencia.findByPk(id, {
      include: [{ model: Aula, include: [{ model: Turma, include: [PeriodoLetivo] }] }]
    });
    if (!freq) throw new AppError('Frequencia não encontrada', 404, 'NAO_ENCONTRADO');
    if (freq.Aula.Turma.PeriodoLetivo && freq.Aula.Turma.PeriodoLetivo.status === 'FECHADO') {
      throw new AppError('Período letivo fechado.', 403, 'PERIODO_FECHADO');
    }

    await freq.update(data);
    await MatriculaService.update(freq.matricula_id, {});
    return freq;
  }
}
export default new FrequenciaService();
