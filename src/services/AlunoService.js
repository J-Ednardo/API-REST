import Aluno from '../models/Aluno';
import Foto from '../models/Foto';
import AppError from '../errors/AppError';

class AlunoService {
  _calcularSituacao(alunoData) {
    let situacao = alunoData.situacao;
    let media_final = alunoData.media_final;

    if (alunoData.faltas && alunoData.faltas > 16) {
      situacao = 'Reprovado por falta';
    } else {
      const hasAllGrades = alunoData.nota1 != null &&
                           alunoData.nota2 != null &&
                           alunoData.nota3 != null;

      if (hasAllGrades) {
        const nota1 = parseFloat(alunoData.nota1);
        const nota2 = parseFloat(alunoData.nota2);
        const nota3 = parseFloat(alunoData.nota3);
        const media = (nota1 + nota2 + nota3) / 3;

        media_final = media.toFixed(2);

        if (media_final >= 7) {
          situacao = 'Aprovado';
        } else {
          situacao = 'Reprovado por nota';
        }
      }
    }

    return { ...alunoData, situacao, media_final };
  }

  async index(queries = {}) {
    let { page = 1, limit = 10, nome, situacao } = queries;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    if (limit > 50) limit = 50; // max limit

    const offset = (page - 1) * limit;
    const where = {};

    if (nome) {
      const { Op } = require('sequelize');
      where.nome = { [Op.like]: `%${nome}%` };
    }

    if (situacao) {
      where.situacao = situacao;
    }

    const { count, rows } = await Aluno.findAndCountAll({
      where,
      limit,
      offset,
      attributes: [
        'id', 'nome', 'sobrenome', 'email', 'idade',
        'nota1', 'nota2', 'nota3', 'media_final', 'faltas', 'situacao'
      ],
      order: [['nome', 'ASC'], ['id', 'ASC']],
      include: {
        model: Foto,
        attributes: ['id', 'filename', 'originalname', 'url']
      }
    });

    return {
      data: rows,
      meta: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  async show(id) {
    if (!id) throw new AppError('Faltando ID', 400, 'VALIDACAO_ID');

    const aluno = await Aluno.findByPk(id, {
      attributes: [
        'id', 'nome', 'sobrenome', 'email', 'idade',
        'nota1', 'nota2', 'nota3', 'media_final', 'faltas', 'situacao'
      ],
      order: [['id', 'DESC'], [Foto, 'id', 'DESC']],
      include: {
        model: Foto,
        attributes: ['id', 'filename', 'originalname', 'url']
      }
    });

    if (!aluno) throw new AppError('Aluno não existe', 404, 'NAO_ENCONTRADO');

    return aluno;
  }

  async store(data) {
    const dadosProcessados = this._calcularSituacao(data);
    const aluno = await Aluno.create(dadosProcessados);
    return aluno;
  }

  async update(id, data) {
    if (!id) throw new AppError('Faltando ID', 400, 'VALIDACAO_ID');
    
    const aluno = await Aluno.findByPk(id);
    if (!aluno) throw new AppError('Aluno não existe', 404, 'NAO_ENCONTRADO');

    // Merge os dados atuais com os novos para calcular a situação corretamente
    const dadosParaCalcular = {
      ...aluno.toJSON(),
      ...data
    };

    const dadosProcessados = this._calcularSituacao(dadosParaCalcular);
    return await aluno.update(dadosProcessados);
  }

  async delete(id) {
    if (!id) throw new AppError('Faltando ID', 400, 'VALIDACAO_ID');

    const aluno = await Aluno.findByPk(id);
    if (!aluno) throw new AppError('Aluno não existe', 404, 'NAO_ENCONTRADO');

    await aluno.destroy();
    return 'Aluno apagado com sucesso';
  }
}

export default new AlunoService();
