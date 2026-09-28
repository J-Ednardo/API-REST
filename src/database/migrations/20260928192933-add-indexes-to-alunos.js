'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('alunos', ['nome'], {
      name: 'alunos_nome_idx'
    });
    await queryInterface.addIndex('alunos', ['situacao'], {
      name: 'alunos_situacao_idx'
    });
    await queryInterface.addIndex('alunos', ['deleted_at'], {
      name: 'alunos_deleted_at_idx'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('alunos', 'alunos_deleted_at_idx');
    await queryInterface.removeIndex('alunos', 'alunos_situacao_idx');
    await queryInterface.removeIndex('alunos', 'alunos_nome_idx');
  }
};
