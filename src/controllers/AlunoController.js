import AlunoService from '../services/AlunoService';

class AlunoController {
  async index(req, res) {
    const alunosResult = await AlunoService.index(req.query);
    res.json(alunosResult);
  }

  async show(req, res) {
    const aluno = await AlunoService.show(req.params.id);
    return res.json(aluno);
  }

  async store(req, res) {
    const aluno = await AlunoService.store(req.body);
    return res.json(aluno);
  }

  async update(req, res) {
    const alunoAtualizado = await AlunoService.update(req.params.id, req.body);
    return res.json(alunoAtualizado);
  }

  async delete(req, res) {
    const message = await AlunoService.delete(req.params.id);
    return res.json(message);
  }
}

export default new AlunoController();
