module.exports = {
  up: async (queryInterface) => {
    try {
      const [duplicates] = await queryInterface.sequelize.query(
        'SELECT turma_id, data, COUNT(*) as total FROM aulas GROUP BY turma_id, data HAVING total > 1',
      );

      if (duplicates && duplicates.length > 0) {
        for (const dup of duplicates) {
          const dateStr = dup.data instanceof Date
            ? dup.data.toISOString().split('T')[0]
            : String(dup.data).split('T')[0];

          const [aulas] = await queryInterface.sequelize.query(
            `SELECT id FROM aulas WHERE turma_id = ${dup.turma_id} AND data = '${dateStr}' ORDER BY id ASC`,
          );

          if (aulas && aulas.length > 1) {
            for (const aula of aulas) {
              const [freqs] = await queryInterface.sequelize.query(
                `SELECT id FROM frequencias WHERE aula_id = ${aula.id}`,
              );
              // Se não tiver frequências associadas, remove a aula duplicada órfã
              if (!freqs || freqs.length === 0) {
                await queryInterface.sequelize.query(`DELETE FROM aulas WHERE id = ${aula.id}`);
              }
            }
          }
        }
      }
    } catch (e) {
      // Ignora erro de limpeza caso a tabela esteja vazia
    }

    await queryInterface.addConstraint('aulas', {
      fields: ['turma_id', 'data'],
      type: 'unique',
      name: 'unique_turma_data_aulas',
    });
  },

  down: async (queryInterface) => {
    // Garante índice para a foreign key turma_id antes de remover o constraint único
    try {
      await queryInterface.addIndex('aulas', ['turma_id'], { name: 'aulas_turma_id_idx' });
    } catch (e) {
      // Índice pode já existir
    }
    await queryInterface.removeConstraint('aulas', 'unique_turma_data_aulas');
  },
};
