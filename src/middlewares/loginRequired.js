import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const { authorization } = req.headers;

  if(!authorization) {
    return res.status(401).json({
      errors: ['Login necessário'],
    });
  }

  const [, token] = authorization.split(' ');

  try {
    const dados = jwt.verify(token, process.env.TOKEN_SECRET);
    const { id, email } = dados;
    req.user = {}; // Adicione esta linha para inicializar o objeto req.user
    req.user.id = id;
    req.user.email = email;
    return next();
  } catch(e) {
    return res.status(401).json({
      errors: ['Token inválido'],
    });
  }
};
