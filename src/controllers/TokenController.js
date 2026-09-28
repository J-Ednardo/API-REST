import User from '../models/User';
import jwt from 'jsonwebtoken';
import AppError from '../errors/AppError';

class TokenController {
  async store(req, res) {
    const { email = '', password = '' } = req.body;

    if(!email || !password) {
      throw new AppError('Credenciais inválidas', 401, 'NAO_AUTORIZADO');
    }

    const user = await User.findOne({ where: { email } })

    if(!user) {
      throw new AppError('Credenciais inválidas', 401, 'NAO_AUTORIZADO');
    }

    if(!(await user.passwordIsValid(password))) {
      throw new AppError('Credenciais inválidas', 401, 'NAO_AUTORIZADO');
    }

    const { id, perfil, aluno_id } = user;
    const token = jwt.sign({ id, email, perfil, aluno_id }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION,
     });

    return res.json({ token, user: { nome: user.nome, id, email, perfil, aluno_id } });
  }
}
export default new TokenController();
