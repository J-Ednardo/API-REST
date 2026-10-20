module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('users', 'perfil', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'PROFESSOR',
      });
    } catch (e) {
      // Ignora se a coluna 'perfil' já tiver sido adicionada em tentativa anterior
    }

    try {
      await queryInterface.addColumn('users', 'aluno_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    } catch (e) {
      // Ignora se a coluna 'aluno_id' já existir
    }

    try {
      await queryInterface.addConstraint('users', {
        fields: ['aluno_id'],
        type: 'foreign key',
        name: 'users_aluno_id_fk',
        references: {
          table: 'alunos',
          field: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    } catch (e) {
      // Ignora se a constraint já existir
    }
  },

  down: async (queryInterface) => {
    try {
      await queryInterface.removeConstraint('users', 'users_aluno_id_fk');
    } catch (e) {
      // Ignora se não existir
    }
    try {
      await queryInterface.removeColumn('users', 'aluno_id');
    } catch (e) {
      // Ignora se não existir
    }
    try {
      await queryInterface.removeColumn('users', 'perfil');
    } catch (e) {
      // Ignora se não existir
    }
  },
};
