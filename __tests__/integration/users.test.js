import request from 'supertest';
import app from '../../src/app';
import truncate from '../utils/truncate';

describe('Users', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('deve cadastrar um usuário válido em rota pública', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        nome: 'Teste',
        email: 'teste@teste.com',
        password: '123456'
      });

    expect(response.status).toBe(200);
    expect(response.body.nome).toBe('Teste');
  });
});
