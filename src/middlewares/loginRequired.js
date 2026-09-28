import jwt from 'jsonwebtoken';
import User from '../models/User';
import AppError from '../errors/AppError';

export default async (req, res, next) => {
  const { authorization } = req.headers;

  if(!authorization) {
    throw new AppError('Login necessário', 401, 'NAO_AUTORIZADO');
  }

  const [, token] = authorization.split(' ');

  try {
    const dados = jwt.verify(token, process.env.TOKEN_SECRET);
    const { id, email } = dados;

    const user = await User.findOne({
      where: {
        id,
        email
      },
    });

    if(!user) {
      throw new AppError('Usuário inválido', 401, 'NAO_AUTORIZADO');
    }
    
    req.user = {}
    req.user.id = id;
    req.user.email = email;
    return next();
  } catch(e) {
    throw new AppError('Token inválido ou expirado', 401, 'NAO_AUTORIZADO');
  }
};
