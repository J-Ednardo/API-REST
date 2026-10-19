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

  it('deve retornar PeriodoLetivo e Disciplina ao buscar detalhes da turma', async () => {
    const response = await request(app)
      .get(`/turmas/${turma.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('PeriodoLetivo');
    expect(response.body.PeriodoLetivo.status).toBe('ABERTO');
    expect(response.body).toHaveProperty('Disciplina');
    expect(response.body.Disciplina.nome).toBe('Matemática');
  });

  it('deve bloquear criacao e alteracao de turma e matricula quando o semestre estiver FECHADO', async () => {
    const adminUser = await User.create({
      nome: 'Admin Teste',
      email: 'admin@teste.com',
      password: 'secretpassword',
      perfil: 'ADMIN',
    });

    const adminToken = jwt.sign(
      { id: adminUser.id, email: adminUser.email, perfil: adminUser.perfil },
      process.env.TOKEN_SECRET || 'segredodeteste123',
      { expiresIn: process.env.TOKEN_EXPIRATION || '7d' }
    );

    const periodoFechado = await PeriodoLetivo.create({
      nome: '2025.2',
      data_inicio: '2025-08-01',
      data_fim: '2025-12-15',
      status: 'FECHADO',
    });

    // Tentar criar turma em semestre fechado
    const resCriarTurma = await request(app)
      .post('/turmas')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        codigo: 'MAT-FECHADA',
        disciplina_id: turma.disciplina_id,
        periodo_id: periodoFechado.id,
        professor_id: turma.professor_id,
      });

    expect(resCriarTurma.status).toBe(403);
    expect(resCriarTurma.body.erro.codigo).toBe('PERIODO_FECHADO');

    // Fechar o período da turma existente
    await PeriodoLetivo.update({ status: 'FECHADO' }, { where: { id: turma.periodo_id } });

    // Tentar atualizar a turma de semestre fechado
    const resAtualizarTurma = await request(app)
      .put(`/turmas/${turma.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ codigo: 'MAT-ALTERADA' });

    expect(resAtualizarTurma.status).toBe(403);
    expect(resAtualizarTurma.body.erro.codigo).toBe('PERIODO_FECHADO');

    // Tentar matricular aluno em turma de semestre fechado
    const resMatricular = await request(app)
      .post('/matriculas')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        turma_id: turma.id,
        aluno_id: 1,
      });

    expect(resMatricular.status).toBe(403);
    expect(resMatricular.body.erro.codigo).toBe('PERIODO_FECHADO');
  });

  it('deve restringir PROFESSOR apenas as suas proprias turmas e impedir criacao de turma', async () => {
    const outroProf = await User.create({
      nome: 'Outro Professor',
      email: 'outro@teste.com',
      password: 'secretpassword',
      perfil: 'PROFESSOR',
    });

    const turmaOutroProf = await Turma.create({
      codigo: 'MAT-B',
      disciplina_id: turma.disciplina_id,
      periodo_id: turma.periodo_id,
      professor_id: outroProf.id,
    });

    // Professor não pode criar turma (exclusivo ADMIN)
    const resCriar = await request(app)
      .post('/turmas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        codigo: 'MAT-C',
        disciplina_id: turma.disciplina_id,
        periodo_id: turma.periodo_id,
        professor_id: turma.professor_id,
      });
    expect(resCriar.status).toBe(403);

    // GET /turmas para o professor logado só retorna a turma dele
    const resLista = await request(app)
      .get('/turmas')
      .set('Authorization', `Bearer ${token}`);
    expect(resLista.status).toBe(200);
    expect(resLista.body.length).toBe(1);
    expect(resLista.body[0].id).toBe(turma.id);

    // Professor não pode acessar nem criar aula na turma de outro professor
    const resShowOutra = await request(app)
      .get(`/turmas/${turmaOutroProf.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(resShowOutra.status).toBe(403);

    const resAulaOutra = await request(app)
      .post(`/turmas/${turmaOutroProf.id}/aulas`)
      .set('Authorization', `Bearer ${token}`)
      .send({ data: '2026-03-15', conteudo: 'Aula indevida' });
    expect(resAulaOutra.status).toBe(403);
  });
});

