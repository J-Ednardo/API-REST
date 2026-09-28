import MatriculaService from '../../src/services/MatriculaService';

describe('MatriculaService', () => {

  it('deve aprovar se media >= 7', () => {
    const res = MatriculaService._calcularSituacao(7, 8, 9, null, 10);
    expect(res.media_final).toBe("8.00");
    expect(res.situacao).toBe('Aprovado');
  });

  it('deve colocar em recuperacao se media < 7 e media >= 5', () => {
    const res = MatriculaService._calcularSituacao(5, 5, 5, null, 10);
    expect(res.media_final).toBe("5.00");
    expect(res.situacao).toBe('Em Recuperação');
  });

  it('deve reprovar por nota se a media < 5', () => {
    const res = MatriculaService._calcularSituacao(4, 4, 4, null, 10);
    expect(res.media_final).toBe("4.00");
    expect(res.situacao).toBe('Reprovado por nota');
  });

  it('deve aprovar se recuperacao deixar a media_final >= 6', () => {
    const res = MatriculaService._calcularSituacao(5, 5, 5, 7, 10);
    // (5 + 7) / 2 = 6
    expect(res.media_final).toBe("6.00");
    expect(res.situacao).toBe('Aprovado');
  });

  it('deve reprovar se recuperacao nao alcancar media >= 6', () => {
    const res = MatriculaService._calcularSituacao(5, 5, 5, 6, 10);
    expect(res.media_final).toBe("5.50");
    expect(res.situacao).toBe('Reprovado por nota');
  });

  it('deve reprovar por falta independentemente de notas altas', () => {
    const res = MatriculaService._calcularSituacao(10, 10, 10, null, 10, 7);
    // 10 + 7 = 17 faltas (> 16)
    expect(res.situacao).toBe('Reprovado por falta');
  });

  it('nao deve reprovar por falta se exatas 16 faltas', () => {
    const res = MatriculaService._calcularSituacao(10, 10, 10, null, 10, 6);
    // 10 + 6 = 16 faltas (<= 16)
    expect(res.situacao).toBe('Aprovado');
  });
});
