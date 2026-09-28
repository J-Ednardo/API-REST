import User from '../models/User';
import AppError from '../errors/AppError';

class UserController {
  async store(req, res) {
    const novoUser = await User.create(req.body);
    const { id, nome, email } = novoUser;
    return res.json({ id, nome, email });
  }

  async index(req, res) {
    const users = await User.findAll({ attributes: ['id', 'nome', 'email'] });
    return res.json(users);
  }

  async show(req, res) {
    const user = await User.findByPk(req.params.id);
    if (!user) throw new AppError('Usuário não existe', 404, 'NAO_ENCONTRADO');
    const { id, nome, email } = user;
    return res.json({ id, nome, email });
  }

  async update(req, res) {
    const user = await User.findByPk(req.user.id);
    if (!user) throw new AppError('Usuário não existe', 404, 'NAO_ENCONTRADO');

    const novosDados = await user.update(req.body);
    const { id, nome, email } = novosDados;
    return res.json({ id, nome, email });
  }

  async delete(req, res) {
    const user = await User.findByPk(req.user.id);
    if (!user) throw new AppError('Usuário não existe', 404, 'NAO_ENCONTRADO');

    await user.destroy();
    return res.json('Usuário deletado com sucesso');
  }
}

export default new UserController();
