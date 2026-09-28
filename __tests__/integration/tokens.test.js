import request from 'supertest';
import app from '../../src/app';
import truncate from '../utils/truncate';
import User from '../../src/models/User';

describe('Tokens', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('deve retornar um token JWT válido ao enviar credenciais corretas', async () => {
    const user = await User.create({
      nome: 'Teste',
      email: 'teste@teste.com',
      password: '123456'
    });

    const response = await request(app)
      .post('/tokens')
      .send({
        email: 'teste@teste.com',
        password: '123456'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('deve retornar HTTP 401 com senha incorreta', async () => {
    const user = await User.create({
      nome: 'Teste',
      email: 'teste@teste.com',
      password: '123456'
    });

    const response = await request(app)
      .post('/tokens')
      .send({
        email: 'teste@teste.com',
        password: '456'
      });

    expect(response.status).toBe(401);
    expect(response.body.erro.mensagem).toBe('Credenciais inválidas');
  });
});
