import User from '../models/User.js';
import AppError from '../errors/AppError.js';
import bcryptjs from 'bcryptjs';

class UserService {
  async index() {
    return User.findAll({ attributes: ['id', 'nome', 'email', 'perfil', 'aluno_id'] });
  }

  async show(id) {
    const user = await User.findByPk(id);
    if (!user) throw new AppError('Usuário não existe', 404, 'NAO_ENCONTRADO');
    return user;
  }

  async store(data) {
    if (data.password) {
      data.password_hash = await bcryptjs.hash(data.password, 8);
    }
    return User.create(data);
  }

  async update(id, data) {
    const user = await User.findByPk(id);
    if (!user) throw new AppError('Usuário não existe', 404, 'NAO_ENCONTRADO');

    if (data.password) {
      data.password_hash = await bcryptjs.hash(data.password, 8);
    }

    return user.update(data);
  }

  async delete(id) {
    const user = await User.findByPk(id);
    if (!user) throw new AppError('Usuário não existe', 404, 'NAO_ENCONTRADO');
    
    await user.destroy();
    return true;
  }
}

export default new UserService();
