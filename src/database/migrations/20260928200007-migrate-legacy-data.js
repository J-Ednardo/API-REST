module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Inserir dados legados
    const now = new Date();

    // Periodo Legado
    await queryInterface.bulkInsert('periodos_letivos', [{
      nome: 'Legado',
      status: 'FECHADO',
      created_at: now,
      updated_at: now,
    }]);

    // Busca o id do periodo
    const periodos = await queryInterface.sequelize.query(
      'SELECT id FROM periodos_letivos WHERE nome = \'Legado\' LIMIT 1;',
    );
    const periodoId = periodos[0][0].id;

    // Disciplina Legado
    await queryInterface.bulkInsert('disciplinas', [{
      nome: 'Matérias Gerais',
      carga_horaria: 100,
      created_at: now,
      updated_at: now,
    }]);

    const disciplinas = await queryInterface.sequelize.query(
      'SELECT id FROM disciplinas WHERE nome = \'Matérias Gerais\' LIMIT 1;',
    );
    const disciplinaId = disciplinas[0][0].id;

    // Turma Legada
    await queryInterface.bulkInsert('turmas', [{
      codigo: 'LEGADO-01',
      periodo_id: periodoId,
      disciplina_id: disciplinaId,
      created_at: now,
      updated_at: now,
    }]);

    const turmas = await queryInterface.sequelize.query(
      'SELECT id FROM turmas WHERE codigo = \'LEGADO-01\' LIMIT 1;',
    );
    const turmaId = turmas[0][0].id;

    // 2. Migrar alunos para matriculas
    await queryInterface.sequelize.query(`
      INSERT INTO matriculas (aluno_id, turma_id, nota1, nota2, nota3, media_final, faltas_legado, situacao, created_at, updated_at)
      SELECT id, ${turmaId}, nota1, nota2, nota3, media_final, faltas, situacao, '${now.toISOString().slice(0, 19).replace('T', ' ')}', '${now.toISOString().slice(0, 19).replace('T', ' ')}'
      FROM alunos;
    `);

    // 3. Remover colunas antigas
    await queryInterface.removeColumn('alunos', 'nota1');
    await queryInterface.removeColumn('alunos', 'nota2');
    await queryInterface.removeColumn('alunos', 'nota3');
    await queryInterface.removeColumn('alunos', 'media_final');
    await queryInterface.removeColumn('alunos', 'faltas');
    await queryInterface.removeColumn('alunos', 'situacao');
  },

  down: async (queryInterface, Sequelize) => {
    // 1. Recriar colunas em alunos
    await queryInterface.addColumn('alunos', 'nota1', { type: Sequelize.FLOAT, allowNull: true });
    await queryInterface.addColumn('alunos', 'nota2', { type: Sequelize.FLOAT, allowNull: true });
    await queryInterface.addColumn('alunos', 'nota3', { type: Sequelize.FLOAT, allowNull: true });
    await queryInterface.addColumn('alunos', 'media_final', { type: Sequelize.FLOAT, allowNull: true });
    await queryInterface.addColumn('alunos', 'faltas', { type: Sequelize.INTEGER, allowNull: true });
    await queryInterface.addColumn('alunos', 'situacao', { type: Sequelize.STRING, allowNull: true });

    // 2. Restaurar dados
    await queryInterface.sequelize.query(`
      UPDATE alunos a
      INNER JOIN matriculas m ON a.id = m.aluno_id
      SET a.nota1 = m.nota1,
          a.nota2 = m.nota2,
          a.nota3 = m.nota3,
          a.media_final = m.media_final,
          a.faltas = m.faltas_legado,
          a.situacao = m.situacao;
    `);

    // 3. Deletar legados
    await queryInterface.sequelize.query('DELETE FROM matriculas;');
    await queryInterface.sequelize.query('DELETE FROM turmas WHERE codigo = \'LEGADO-01\';');
    await queryInterface.sequelize.query('DELETE FROM disciplinas WHERE nome = \'Matérias Gerais\';');
    await queryInterface.sequelize.query('DELETE FROM periodos_letivos WHERE nome = \'Legado\';');
  },
};
