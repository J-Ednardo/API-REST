'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.removeColumn('alunos', 'peso');
    await queryInterface.removeColumn('alunos', 'altura');


    await queryInterface.addColumn('alunos', 'nota1', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('alunos', 'nota2', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('alunos', 'nota3', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('alunos', 'media_final', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('alunos', 'situacao', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('alunos', 'faltas', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.addColumn('alunos', 'peso', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('alunos', 'altura', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    
    await queryInterface.removeColumn('alunos', 'nota1');
    await queryInterface.removeColumn('alunos', 'nota2');
    await queryInterface.removeColumn('alunos', 'nota3');
    await queryInterface.removeColumn('alunos', 'media_final');
    await queryInterface.removeColumn('alunos', 'situacao');
    await queryInterface.removeColumn('alunos', 'faltas');
  }
};
