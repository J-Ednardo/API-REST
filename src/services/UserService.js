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
    const payload = {
      nome: data.nome,
      email: data.email,
      password: data.password,
      perfil: 'ALUNO',
      aluno_id: null,
    };
    if (payload.password) {
      payload.password_hash = await bcryptjs.hash(payload.password, 8);
    }
    return User.create(payload);
  }

  async update(id, data, isAdmin = false) {
    const user = await User.findByPk(id);
    if (!user) throw new AppError('Usuário não existe', 404, 'NAO_ENCONTRADO');

    const payload = { ...data };
    if (!isAdmin) {
      delete payload.perfil;
      delete payload.aluno_id;
    }

    if (payload.password) {
      payload.password_hash = await bcryptjs.hash(payload.password, 8);
    }

    return user.update(payload);
  }

  async delete(id) {
    const user = await User.findByPk(id);
    if (!user) throw new AppError('Usuário não existe', 404, 'NAO_ENCONTRADO');

    await user.destroy();
    return true;
  }
}

export default new UserService();
