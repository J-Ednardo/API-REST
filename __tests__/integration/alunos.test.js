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
      password: '123456',
      perfil: 'ADMIN'
    });
    
    token = jwt.sign({ id: user.id, email: user.email, perfil: user.perfil, aluno_id: user.aluno_id }, process.env.TOKEN_SECRET || 'segredodeteste123', {
      expiresIn: process.env.TOKEN_EXPIRATION || '7d'
    });
  });

  it('deve bloquear listar todos os alunos sem token (GET /alunos)', async () => {
    const response = await request(app).get('/alunos');
    expect(response.status).toBe(401);
  });

  it('deve listar todos os alunos se for admin (GET /alunos)', async () => {
    const response = await request(app)
      .get('/alunos')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('deve cadastrar aluno com token de ADMIN (POST /alunos)', async () => {
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

  it('deve bloquear criacao de aluno com token de ALUNO', async () => {
    const userAluno = await User.create({
      nome: 'Aluno Teste',
      email: 'aluno@teste.com',
      password: '123456',
      perfil: 'ALUNO'
    });
    
    const tokenAluno = jwt.sign({ id: userAluno.id, email: userAluno.email, perfil: userAluno.perfil }, process.env.TOKEN_SECRET || 'segredodeteste123', {
      expiresIn: process.env.TOKEN_EXPIRATION || '7d'
    });

    const response = await request(app)
      .post('/alunos')
      .set('Authorization', `Bearer ${tokenAluno}`)
      .send({
        nome: 'João',
        sobrenome: 'Silva',
        email: 'joao3@silva.com'
      });

    expect(response.status).toBe(403);
  });
});
