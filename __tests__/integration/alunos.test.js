import request from 'supertest';
import app from '../../src/app';
import truncate from '../utils/truncate';
import User from '../../src/models/User';
import jwt from 'jsonwebtoken';

describe('Alunos', () => {
  let token;

  beforeEach(async () => {
    await truncate();
    
    const user = await User.create({
      nome: 'Teste',
      email: 'admin@teste.com',
      password: '123456'
    });
    
    token = jwt.sign({ id: user.id, email: user.email }, process.env.TOKEN_SECRET || 'segredodeteste123', {
      expiresIn: process.env.TOKEN_EXPIRATION || '7d'
    });
  });

  it('deve listar todos os alunos (GET /alunos)', async () => {
    const response = await request(app).get('/alunos');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('deve cadastrar aluno com token e aplicar regras (POST /alunos)', async () => {
    const response = await request(app)
      .post('/alunos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'João',
        sobrenome: 'Silva',
        email: 'joao@silva.com',
        idade: 15,
        nota1: 8,
        nota2: 8,
        nota3: 8,
        faltas: 5
      });

    expect(response.status).toBe(200);
    expect(response.body.nome).toBe('João');
    // Verifica a regra de negócio aplicada no banco
    expect(response.body.media_final).toBe("8.00");
    expect(response.body.situacao).toBe('Aprovado');
  });

  it('deve retornar 401 ao tentar criar aluno sem token', async () => {
    const response = await request(app)
      .post('/alunos')
      .send({
        nome: 'João',
        sobrenome: 'Silva',
        email: 'joao@silva.com',
        idade: 15
      });

    expect(response.status).toBe(401);
  });
});
