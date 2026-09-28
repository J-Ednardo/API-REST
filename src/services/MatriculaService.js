import Matricula from '../models/Matricula';
import Turma from '../models/Turma';
import PeriodoLetivo from '../models/PeriodoLetivo';
import Frequencia from '../models/Frequencia';
import AppError from '../errors/AppError';

class MatriculaService {
  _calcularSituacao(nota_1, nota_2, nota_3, nota_recuperacao, faltas_legado, faltas_registradas) {
    const totalFaltas = (Number(faltas_legado) || 0) + (Number(faltas_registradas) || 0);

    const notas = [nota_1, nota_2, nota_3].filter((n) => n != null).map((n) => Number(n) || 0);
    const media = notas.length === 3 ? notas.reduce((a, b) => a + b, 0) / 3 : null;
    let mediaFinal = media !== null ? media.toFixed(2) : null;

    if (totalFaltas > 16) {
      return { situacao: 'Reprovado por falta', media_final: mediaFinal };
    }

    if (notas.length < 3) return { situacao: 'Cursando', media_final: mediaFinal };

    let situacao = '';

    // Calcula situação base
    if (media >= 7.0) {
      situacao = 'Aprovado';
    } else if (media < 5.0) {
      situacao = 'Reprovado por nota';
    } else {
      situacao = 'Em Recuperação';
    }

    // Se estiver em recuperação e o professor tiver lançado nota do exame
    if (situacao === 'Em Recuperação' && nota_recuperacao !== undefined && nota_recuperacao !== null) {
      const novaMedia = (media + Number(nota_recuperacao)) / 2;
      mediaFinal = novaMedia.toFixed(2);
      situacao = novaMedia >= 6.0 ? 'Aprovado' : 'Reprovado por nota';
    }

    return { situacao, media_final: mediaFinal };
  }

  async index(aluno_id = null) {
    const where = aluno_id ? { aluno_id } : {};
    return await Matricula.findAll({
      where,
      include: [
        {
          model: Turma,
          include: [
            PeriodoLetivo,
            { model: require('../models/Disciplina').default },
          ],
        },
        { model: Frequencia },
      ],
    });
  }

  async show(id, aluno_id = null) {
    const where = { id };
    if (aluno_id) where.aluno_id = aluno_id;

    return await Matricula.findOne({
      where,
      include: [
        {
          model: Turma,
          include: [
            PeriodoLetivo,
            { model: require('../models/Disciplina').default },
          ],
        },
        { model: Frequencia },
      ],
    });
  }

  async store(data) {
    return await Matricula.create(data);
  }

  async update(id, data) {
    const matricula = await Matricula.findByPk(id, {
      include: [{ model: Turma, include: [PeriodoLetivo] }],
    });

    if (!matricula) throw new AppError('Matrícula não encontrada', 404, 'NAO_ENCONTRADO');

    if (matricula.Turma && matricula.Turma.PeriodoLetivo && matricula.Turma.PeriodoLetivo.status === 'FECHADO') {
      throw new AppError('Não é possível editar matrícula de um período letivo fechado.', 403, 'PERIODO_FECHADO');
    }

    const faltas_registradas = await Frequencia.count({
      where: { matricula_id: id, presente: false },
    });

    const n1 = data.nota1 !== undefined ? data.nota1 : matricula.nota1;
    const n2 = data.nota2 !== undefined ? data.nota2 : matricula.nota2;
    const n3 = data.nota3 !== undefined ? data.nota3 : matricula.nota3;
    const nRec = data.nota_recuperacao !== undefined ? data.nota_recuperacao : matricula.nota_recuperacao;

    const { situacao, media_final } = this._calcularSituacao(n1, n2, n3, nRec, matricula.faltas_legado, faltas_registradas);

    data.situacao = situacao;
    data.media_final = media_final;

    return await matricula.update(data);
  }

  async delete(id) {
    const matricula = await Matricula.findByPk(id);
    if (!matricula) throw new AppError('Matrícula não encontrada', 404, 'NAO_ENCONTRADO');
    await matricula.destroy();
  }
}

export default new MatriculaService();
