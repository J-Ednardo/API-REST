module.exports = {
  up: async (queryInterface, Sequelize) => {
    if (queryInterface.sequelize.getDialect() === 'sqlite') {
      return queryInterface.changeColumn('alunos', 'email', {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      });
    }

    try {
      await queryInterface.addIndex('alunos', ['email'], {
        unique: true,
        name: 'alunos_email_unique',
      });
    } catch (e) {
      // Se o índice já existir, ignora
    }
  },

  down: async (queryInterface) => {
    if (queryInterface.sequelize.getDialect() === 'sqlite') {
      return;
    }
    try {
      await queryInterface.removeIndex('alunos', 'alunos_email_unique');
    } catch (e) {
      // Ignora se não existir
    }
  },
};
