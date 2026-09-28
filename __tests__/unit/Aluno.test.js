import truncate from '../utils/truncate';
import AlunoService from '../../src/services/AlunoService';
import connection from '../../src/database/index'; 

describe('Aluno', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('deve calcular a média corretamente e aprovar se media >= 7 e faltas <= 16', async () => {
    const aluno = await AlunoService.store({
      nome: 'Teste',
      sobrenome: 'Da Silva',
      email: 'teste@teste.com',
      idade: 20,
      nota1: 7,
      nota2: 8,
      nota3: 9,
      faltas: 10
    });

    expect(aluno.media_final).toBe("8.00");
    expect(aluno.situacao).toBe('Aprovado');
  });

  it('deve reprovar por nota se a media < 7 e faltas <= 16', async () => {
    const aluno = await AlunoService.store({
      nome: 'Teste',
      sobrenome: 'Da Silva',
      email: 'teste2@teste.com',
      idade: 20,
      nota1: 5,
      nota2: 5,
      nota3: 5,
      faltas: 10
    });

    expect(aluno.media_final).toBe("5.00");
    expect(aluno.situacao).toBe('Reprovado por nota');
  });

  it('deve reprovar por falta quando faltas > 16 independente da nota', async () => {
    const aluno = await AlunoService.store({
      nome: 'Teste',
      sobrenome: 'Da Silva',
      email: 'teste3@teste.com',
      idade: 20,
      nota1: 10,
      nota2: 10,
      nota3: 10,
      faltas: 17
    });

    expect(aluno.situacao).toBe('Reprovado por falta');
  });
});
