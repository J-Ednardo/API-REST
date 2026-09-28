import Aluno from '../models/Aluno';
import Foto from '../models/Foto';
import Matricula from '../models/Matricula';
import AppError from '../errors/AppError';

class AlunoService {
  async index(queries = {}) {
    let { page = 1, limit = 10, nome } = queries;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    if (limit > 50) limit = 50;

    const offset = (page - 1) * limit;
    const where = {};

    if (nome) {
      const { Op } = require('sequelize');
      where.nome = { [Op.like]: `%${nome}%` };
    }

    const matriculaInclude = {
      model: Matricula,
      attributes: ['id', 'nota1', 'nota2', 'nota3', 'nota_recuperacao', 'media_final', 'faltas_legado', 'situacao', 'turma_id'],
    };

    if (queries.situacao) {
      matriculaInclude.where = { situacao: queries.situacao };
    }

    const { count, rows } = await Aluno.findAndCountAll({
      where,
      limit,
      offset,
      attributes: ['id', 'nome', 'sobrenome', 'email', 'idade'],
      order: [['nome', 'ASC'], ['id', 'ASC']],
      distinct: true, // Necessario por causa do hasMany (Matricula) no findAndCountAll
      include: [
        {
          model: Foto,
          attributes: ['id', 'filename', 'originalname', 'url'],
        },
        matriculaInclude,
      ],
    });

    return {
      data: rows,
      meta: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async show(id) {
    if (!id) throw new AppError('Faltando ID', 400, 'VALIDACAO_ID');

    const aluno = await Aluno.findByPk(id, {
      attributes: ['id', 'nome', 'sobrenome', 'email', 'idade'],
      include: [
        {
          model: Foto,
          attributes: ['id', 'filename', 'originalname', 'url'],
        },
        {
          model: Matricula,
          attributes: ['id', 'nota1', 'nota2', 'nota3', 'nota_recuperacao', 'media_final', 'faltas_legado', 'situacao', 'turma_id'],
        },
      ],
    });

    if (!aluno) throw new AppError('Aluno não existe', 404, 'NAO_ENCONTRADO');

    return aluno;
  }

  async store(data) {
    const aluno = await Aluno.create(data);
    return aluno;
  }

  async update(id, data) {
    if (!id) throw new AppError('Faltando ID', 400, 'VALIDACAO_ID');

    const aluno = await Aluno.findByPk(id);
    if (!aluno) throw new AppError('Aluno não existe', 404, 'NAO_ENCONTRADO');

    return await aluno.update(data);
  }

  async delete(id) {
    if (!id) throw new AppError('Faltando ID', 400, 'VALIDACAO_ID');

    const aluno = await Aluno.findByPk(id);
    if (!aluno) throw new AppError('Aluno não existe', 404, 'NAO_ENCONTRADO');

    await aluno.destroy();
    return 'Aluno apagado com sucesso';
  }

  async gerarHistorico(id) {
    if (!id) throw new AppError('Faltando ID', 400, 'VALIDACAO_ID');

    const aluno = await Aluno.findByPk(id, {
      attributes: ['id', 'nome', 'sobrenome', 'email', 'idade'],
    });

    if (!aluno) throw new AppError('Aluno não existe', 404, 'NAO_ENCONTRADO');

    const MatriculaService = require('./MatriculaService').default;
    const matriculas = await MatriculaService.index(id);

    let cargaHorariaTotal = 0;
    let somaMedias = 0;
    let totalDisciplinasConcluidas = 0;

    const periodosMap = {};

    matriculas.forEach((m) => {
      const periodoNome = m.Turma && m.Turma.PeriodoLetivo ? `${m.Turma.PeriodoLetivo.ano}.${m.Turma.PeriodoLetivo.semestre}` : 'Desconhecido';

      if (!periodosMap[periodoNome]) {
        periodosMap[periodoNome] = [];
      }

      const faltasCalc = (m.faltas_legado || 0) + (m.Frequencias ? m.Frequencias.filter((f) => !f.presente).length : 0);

      periodosMap[periodoNome].push({
        disciplina: m.Turma && m.Turma.Disciplina ? m.Turma.Disciplina.nome : 'N/A',
        carga_horaria: m.Turma && m.Turma.Disciplina ? m.Turma.Disciplina.carga_horaria : 0,
        media_final: m.media_final,
        faltas: faltasCalc,
        situacao: m.situacao,
      });

      if (m.situacao === 'Aprovado') {
        const ch = m.Turma && m.Turma.Disciplina ? m.Turma.Disciplina.carga_horaria : 0;
        cargaHorariaTotal += ch;
      }

      if (m.media_final !== null && m.media_final !== undefined) {
        somaMedias += parseFloat(m.media_final);
        totalDisciplinasConcluidas++;
      }
    });

    const coeficienteRendimento = totalDisciplinasConcluidas > 0
      ? (somaMedias / totalDisciplinasConcluidas).toFixed(2)
      : '0.00';

    return {
      aluno,
      estatisticas: {
        carga_horaria_integralizada: cargaHorariaTotal,
        coeficiente_rendimento: coeficienteRendimento,
      },
      periodos: periodosMap,
    };
  }
}

export default new AlunoService();
