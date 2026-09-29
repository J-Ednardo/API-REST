import bcryptjs from 'bcryptjs';
import User from '../models/User.js';
import AppError from '../errors/AppError.js';

class UserService {
  async index({ page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      attributes: ['id', 'nome', 'email', 'perfil', 'aluno_id'],
      limit: Number(limit),
      offset: Number(offset),
      order: [['id', 'DESC']],
    });

    return {
      data: rows,
      meta: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / limit),
      },
    };
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
