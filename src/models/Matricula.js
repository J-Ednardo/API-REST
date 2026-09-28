import Sequelize, { Model } from 'sequelize';

export default class Matricula extends Model {
  static init(sequelize) {
    super.init({
      nota1: Sequelize.FLOAT,
      nota2: Sequelize.FLOAT,
      nota3: Sequelize.FLOAT,
      nota_recuperacao: Sequelize.FLOAT,
      media_final: Sequelize.FLOAT,
      faltas_legado: Sequelize.INTEGER,
      situacao: Sequelize.STRING,
    }, {
      sequelize,
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Aluno, { foreignKey: 'aluno_id' });
    this.belongsTo(models.Turma, { foreignKey: 'turma_id' });
    this.hasMany(models.Frequencia, { foreignKey: 'matricula_id' });
  }
}
