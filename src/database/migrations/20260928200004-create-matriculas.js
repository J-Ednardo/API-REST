module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('matriculas', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      aluno_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'alunos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      turma_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'turmas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      nota1: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      nota2: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      nota3: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      nota_recuperacao: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      media_final: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      faltas_legado: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      situacao: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('matriculas');
  },
};
