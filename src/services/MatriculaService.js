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
        { model: require('../models/Aluno').default, attributes: ['id', 'nome', 'sobrenome'] },
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
        { model: require('../models/Aluno').default, attributes: ['id', 'nome', 'sobrenome'] },
      ],
    });
  }

  _validarNotas(payload) {
    const camposNota = ['nota1', 'nota2', 'nota3', 'nota_recuperacao'];
    for (const campo of camposNota) {
      const val = payload[campo];
      if (val !== undefined && val !== null && val !== '') {
        const num = Number(val);
        if (Number.isNaN(num) || num < 0 || num > 10) {
          throw new AppError(`A nota (${campo}) deve ser um valor entre 0 e 10.`, 400, 'NOTA_INVALIDA');
        }
        payload[campo] = num;
      } else if (val === '') {
        payload[campo] = null;
      }
    }
  }

  async store(data) {
    if (data.turma_id) {
      const turma = await Turma.findByPk(data.turma_id, {
        include: [PeriodoLetivo],
      });
      if (turma && turma.PeriodoLetivo && turma.PeriodoLetivo.status === 'FECHADO') {
        throw new AppError('Não é possível matricular aluno em uma turma de período letivo fechado.', 403, 'PERIODO_FECHADO');
      }
    }

    if (data.aluno_id && data.turma_id) {
      const jaMatriculado = await Matricula.findOne({
        where: {
          aluno_id: data.aluno_id,
          turma_id: data.turma_id,
        },
      });
      if (jaMatriculado) {
        throw new AppError('Este aluno já está matriculado nesta turma.', 400, 'ALUNO_JA_MATRICULADO');
      }
    }

    this._validarNotas(data);
    return await Matricula.create(data);
  }

  async update(id, data, user = null) {
    const matricula = await Matricula.findByPk(id, {
      include: [{ model: Turma, include: [PeriodoLetivo] }],
    });

    if (!matricula) throw new AppError('Matrícula não encontrada', 404, 'NAO_ENCONTRADO');

    if (user && user.perfil === 'PROFESSOR') {
      if (!matricula.Turma || Number(matricula.Turma.professor_id) !== Number(user.id)) {
        throw new AppError('Você não tem permissão para alterar notas desta turma.', 403, 'PROIBIDO');
      }
    }

    if (matricula.Turma && matricula.Turma.PeriodoLetivo && matricula.Turma.PeriodoLetivo.status === 'FECHADO') {
      throw new AppError('Não é possível editar matrícula de um período letivo fechado.', 403, 'PERIODO_FECHADO');
    }

    const updatePayload = user && user.perfil === 'PROFESSOR'
      ? {
        ...(data.nota1 !== undefined && { nota1: data.nota1 }),
        ...(data.nota2 !== undefined && { nota2: data.nota2 }),
        ...(data.nota3 !== undefined && { nota3: data.nota3 }),
        ...(data.nota_recuperacao !== undefined && { nota_recuperacao: data.nota_recuperacao }),
      }
      : { ...data };

    this._validarNotas(updatePayload);

    const faltas_registradas = await Frequencia.count({
      where: { matricula_id: id, presente: false },
    });

    const n1 = updatePayload.nota1 !== undefined ? updatePayload.nota1 : matricula.nota1;
    const n2 = updatePayload.nota2 !== undefined ? updatePayload.nota2 : matricula.nota2;
    const n3 = updatePayload.nota3 !== undefined ? updatePayload.nota3 : matricula.nota3;
    const nRec = updatePayload.nota_recuperacao !== undefined ? updatePayload.nota_recuperacao : matricula.nota_recuperacao;

    const { situacao, media_final } = this._calcularSituacao(n1, n2, n3, nRec, matricula.faltas_legado, faltas_registradas);

    updatePayload.situacao = situacao;
    updatePayload.media_final = media_final;

    return await matricula.update(updatePayload);
  }

  async delete(id) {
    const matricula = await Matricula.findByPk(id, {
      include: [{ model: Turma, include: [PeriodoLetivo] }],
    });
    if (!matricula) throw new AppError('Matrícula não encontrada', 404, 'NAO_ENCONTRADO');

    if (matricula.Turma && matricula.Turma.PeriodoLetivo && matricula.Turma.PeriodoLetivo.status === 'FECHADO') {
      throw new AppError('Não é possível excluir matrícula de um período letivo fechado.', 403, 'PERIODO_FECHADO');
    }

    await matricula.destroy();
  }
}

export default new MatriculaService();
