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

  it('deve listar todos os alunos se for admin (GET /alunos) com nova estrutura de paginacao', async () => {
    const response = await request(app)
      .get('/alunos')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.meta).toHaveProperty('page');
    expect(response.body.meta).toHaveProperty('limit');
    expect(response.body.meta).toHaveProperty('total');
    expect(response.body.meta).toHaveProperty('totalPages');
  });

  it('deve testar os filtros e a paginacao (GET /alunos?nome=Filtro&limit=1)', async () => {
    // Cria alguns alunos para testar
    await request(app).post('/alunos').set('Authorization', `Bearer ${token}`).send({
      nome: 'Aluno Filtro Um', sobrenome: 'Silva', email: 'f1@s.com', idade: 15
    });
    await request(app).post('/alunos').set('Authorization', `Bearer ${token}`).send({
      nome: 'Aluno Filtro Dois', sobrenome: 'Silva', email: 'f2@s.com', idade: 15
    });

    const response = await request(app)
      .get('/alunos?nome=Filtro&limit=1&page=2')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.meta.limit).toBe(1);
    expect(response.body.meta.page).toBe(2);
    expect(response.body.meta.total).toBe(2); // tem os dois
  });

  it('deve cadastrar aluno com token de ADMIN (POST /alunos)', async () => {
    const response = await request(app)
      .post('/alunos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'João',
        sobrenome: 'Silva',
        email: 'joao@silva.com',
        idade: 15
      });

    expect(response.status).toBe(200);
    expect(response.body.nome).toBe('João');
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

  it('deve executar o soft delete corretamente (DELETE /alunos/:id)', async () => {
    const postResponse = await request(app)
      .post('/alunos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Para Apagar',
        sobrenome: 'Apagado',
        email: 'apagar@teste.com',
        idade: 15
      });
    const alunoId = postResponse.body.id;

    // Soft delete
    const deleteResponse = await request(app)
      .delete(`/alunos/${alunoId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(deleteResponse.status).toBe(200);

    // Nao deve ser listado
    const getResponse = await request(app)
      .get(`/alunos/${alunoId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(getResponse.status).toBe(404);

    // Verifica no BD que ainda existe (soft deleted) e email alterado
    const alunoNoBD = await require('../../src/models/Aluno').default.findByPk(alunoId, { paranoid: false });
    expect(alunoNoBD).toBeTruthy();
    expect(alunoNoBD.deleted_at).toBeTruthy();
    expect(alunoNoBD.email).toContain('deleted_');
    expect(alunoNoBD.email).toContain('apagar@teste.com');
  });
});
