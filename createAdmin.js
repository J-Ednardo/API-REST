import dotenv from 'dotenv';
dotenv.config();
import './src/database';
import UserService from './src/services/UserService';

async function run() {
  try {
    const user = await UserService.store({
      nome: 'Diretor Master',
      email: 'admin@escola.com',
      password: 'password123',
      perfil: 'ADMIN'
    });
    console.log('Usuário ADMIN criado com sucesso no banco!');
  } catch (error) {
    if(error.name === 'SequelizeUniqueConstraintError') {
      console.log('Usuário ADMIN já existe no banco!');
    } else {
      console.log('Erro:', error);
    }
  } finally {
    process.exit(0);
  }
}
run();
