module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'perfil', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'PROFESSOR',
    });

    await queryInterface.addColumn('users', 'aluno_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'alunos',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'aluno_id');
    await queryInterface.removeColumn('users', 'perfil');
  },
};
