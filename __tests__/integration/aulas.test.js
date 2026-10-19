import request from 'supertest';
import app from '../../src/app';
import truncate from '../utils/truncate';
import User from '../../src/models/User';
import Turma from '../../src/models/Turma';
import PeriodoLetivo from '../../src/models/PeriodoLetivo';
import Disciplina from '../../src/models/Disciplina';
import Aula from '../../src/models/Aula';
import jwt from 'jsonwebtoken';

describe('Aulas e Chamada', () => {
  let token;
  let turma;

  beforeEach(async () => {
    await truncate();

    const user = await User.create({
      nome: 'Professor Teste',
      email: 'professor@teste.com',
      password: 'secretpassword',
      perfil: 'PROFESSOR',
    });

    token = jwt.sign(
      { id: user.id, email: user.email, perfil: user.perfil },
      process.env.TOKEN_SECRET || 'segredodeteste123',
      { expiresIn: process.env.TOKEN_EXPIRATION || '7d' }
    );

    const periodo = await PeriodoLetivo.create({
      nome: '2026.1',
      data_inicio: '2026-02-01',
      data_fim: '2026-07-01',
      status: 'ABERTO',
    });

    const disciplina = await Disciplina.create({
      nome: 'Matemática',
      codigo: 'MAT101',
      carga_horaria: 60,
    });

    turma = await Turma.create({
      codigo: 'MAT-A',
      disciplina_id: disciplina.id,
      periodo_id: periodo.id,
      professor_id: user.id,
    });
  });

  it('deve permitir criar aula para uma turma em uma data específica', async () => {
    const response = await request(app)
      .post(`/turmas/${turma.id}/aulas`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        data: '2026-03-10',
        conteudo: 'Introdução ao cálculo',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.data).toBe('2026-03-10');
    expect(response.body.conteudo).toBe('Introdução ao cálculo');
  });

  it('deve impedir criar mais de uma aula para a mesma turma na mesma data', async () => {
    // Primeira criação com sucesso
    const response1 = await request(app)
      .post(`/turmas/${turma.id}/aulas`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        data: '2026-03-10',
        conteudo: 'Primeira chamada',
      });
    expect(response1.status).toBe(201);

    // Segunda tentativa na mesma data para a mesma turma deve falhar
    const response2 = await request(app)
      .post(`/turmas/${turma.id}/aulas`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        data: '2026-03-10',
        conteudo: 'Segunda chamada duplicada',
      });

    expect(response2.status).toBe(400);
    expect(response2.body).toHaveProperty('erro');
    expect(response2.body.erro.codigo).toBe('CHAMADA_JA_REGISTRADA');
    expect(response2.body.erro.mensagem).toBe('Já existe uma aula/chamada registrada para esta turma nesta data.');
  });

  it('deve listar aulas cadastradas da turma', async () => {
    await Aula.create({
      turma_id: turma.id,
      data: '2026-03-10',
      conteudo: 'Aula 1',
    });

    const response = await request(app)
      .get(`/turmas/${turma.id}/aulas`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].conteudo).toBe('Aula 1');
  });
});
