import User from '../models/User';

class UserController {
  // Criar usuário
  async store(req,res) {
    try {
      const novoUser = await User.create(req.body);
      const { id, nome, email } = novoUser;
      return res.json({ id, nome, email });
    } catch(e) {
      return res.status(400).json({
        errors: e.errors.map(err => err.message)
      });
    }
  }

  // Mostrar todos os usuários
  async index(req, res) {
    try {
      const users = await User.findAll({ attributes: ['id', 'nome', 'email'] });
      return res.json(users)
    } catch(e) {
      return res.json(null);
    }
  }

  // Mostrar usuário por ID
  async show(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      const { id, nome, email } = user;
      return res.json({ id, nome, email });
    } catch(e) {
      return res.json(null);
    }
  }

  // Atualizar usuário por ID
  async update(req, res) {
    try {
      const user = await User.findByPk(req.user.id);

      if(!user) {
        return res.status(400).json({
          errors: ['Usuário não existe']
        });
      }

      const novosDados = await user.update(req.body);
      const { id, nome, email } = novosDados;
      return res.json({ id, nome, email });
    } catch(e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }


  // Deletar usuário por ID
  async delete(req, res){
    try {
      const user = await User.findByPk(req.user.id);

      if(!user) {
        return res.status(400).json({
          errors: ['Usuário não existe'],
        });
      }

      await user.destroy();
      return res.json('Usuário deletado com sucesso');
    } catch(e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new UserController();
