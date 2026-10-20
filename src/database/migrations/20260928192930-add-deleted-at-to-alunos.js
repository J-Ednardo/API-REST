module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('alunos', 'deleted_at', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    } catch (e) {
      // Ignora se já existir
    }
  },

  down: async (queryInterface) => {
    try {
      await queryInterface.removeColumn('alunos', 'deleted_at');
    } catch (e) {
      // Ignora se não existir
    }
  },
};
