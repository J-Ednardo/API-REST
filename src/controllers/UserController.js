import UserService from '../services/UserService.js';

class UserController {
  async store(req, res) {
    const novoUser = await UserService.store(req.body);
    const { id, nome, email } = novoUser;
    return res.json({ id, nome, email });
  }

  async index(req, res) {
    const { page, limit } = req.query;
    const result = await UserService.index({ page, limit });
    return res.json(result);
  }

  async show(req, res) {
    const user = await UserService.show(req.params.id);
    const { id, nome, email } = user;
    return res.json({ id, nome, email });
  }

  async update(req, res) {
    const novosDados = await UserService.update(req.user.id, req.body);
    const { id, nome, email } = novosDados;
    return res.json({ id, nome, email });
  }

  async updateAdmin(req, res) {
    const novosDados = await UserService.update(req.params.id, req.body);
    const {
      id, nome, email, perfil, aluno_id,
    } = novosDados;
    return res.json({
      id, nome, email, perfil, aluno_id,
    });
  }

  async delete(req, res) {
    await UserService.delete(req.user.id);
    return res.json('Usuário deletado com sucesso');
  }
}

export default new UserController();
