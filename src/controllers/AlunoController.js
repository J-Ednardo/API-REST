import Aluno from '../models/Aluno';
import Foto from '../models/Foto';

class AlunoController {
  // Mostra todos os alunos
  async index(req, res) {
    const alunos = await Aluno.findAll({
      attributes: ['id', 'nome', 'sobrenome', 'email', 'idade', 'peso', 'altura'],
      order: [['id', 'DESC'], [Foto, 'id', 'DESC']],
      include: {
        model: Foto,
        attributes: ['id', 'filename', 'originalname', 'url']
      }
    });
    res.json(alunos);
  }

  // Mostra um aluno por id
  async show(req, res) {
    try {
      const { id } = req.params;

      if(!id) {
        return res.status(400).json({
          errors: ['Faltando ID']
        });
      }

      const aluno = await Aluno.findByPk(id, {
        attributes: ['id', 'nome', 'sobrenome', 'email', 'idade', 'peso', 'altura'],
        order: [['id', 'DESC'], [Foto, 'id', 'DESC']],
        include: {
          model: Foto,
          attributes: ['id', 'filename', 'originalname', 'url']
        }
      });

      if(!aluno) {
        return res.status(400).json({
          errors: ['Aluno não existe']
        });
      }

      return res.json(aluno);

    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map(err => err.message),
      })
    }
  }

  // Cria um aluno
  async store(req, res) {
    try {
      const aluno = await Aluno.create(req.body);
      return res.json(aluno);
    } catch(e) {
      return res.status(400).json({
        errors: e.errors.map(err => err.message),
      });
    }
  }

  // Atualiza os dados de um aluno
  async update(req, res) {
    try {
      const { id } = req.params;

      if(!id) {
        return res.status(400).json({
          errors: ['Faltando ID'],
        });
      }

      const aluno = await Aluno.findByPk(id);

      if(!aluno) {
        return res.status(400).json({
          errors: ['Aluno não existe'],
        });
      }

      const alunoAtualizado = await aluno.update(req.body);
      return res.json(alunoAtualizado);

    } catch(e) {
      return res.status(400).json({
        errors: e.errors.map(err => err.message),
      });
    }
  }

  // Deleta um aluno por id
  async delete(req, res) {
    try {
      const { id } = req.params;

      if(!id) {
        return res.status(400).json({
          errors: ['Faltando ID']
        });
      }

      const aluno = await Aluno.findByPk(id);

      if(!aluno) {
        return res.status(400).json({
          errors: ['Aluno não existe'],
        });
      }

      await aluno.destroy();
      return res.json('Aluno apagado com sucesso');

    } catch(e) {
      return res.status(400).json({
        errors: e.errors.map(err => err.message),
      });
    }
  }


}

export default new AlunoController();
