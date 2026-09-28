import request from 'supertest';
import app from '../../src/app';
import truncate from '../utils/truncate';
import UserService from '../../src/services/UserService';

describe('Tokens', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('deve retornar um token JWT válido ao enviar credenciais corretas', async () => {
    await UserService.store({
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
    expect(response.body.user).toHaveProperty('perfil');
  });

  it('deve retornar HTTP 401 com senha incorreta', async () => {
    await UserService.store({
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

  it('deve retornar 429 quando exceder limite de requisicoes (Rate Limit)', async () => {
    // loginLimiter max = 5
    for(let i=0; i<5; i++) {
      await request(app).post('/tokens').send({ email: 'fake@teste.com', password: '123' });
    }
    const response = await request(app).post('/tokens').send({ email: 'fake@teste.com', password: '123' });
    
    expect(response.status).toBe(429);
    expect(response.body.erro.codigo).toBe('MUITAS_REQUISICOES');
  });
});
