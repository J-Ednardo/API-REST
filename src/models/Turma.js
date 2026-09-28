import Sequelize, { Model } from "sequelize";

export default class Turma extends Model {
  static init(sequelize) {
    super.init({
      codigo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    }, {
      sequelize,
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.PeriodoLetivo, { foreignKey: 'periodo_id' });
    this.belongsTo(models.Disciplina, { foreignKey: 'disciplina_id' });
    this.belongsTo(models.User, { foreignKey: 'professor_id', as: 'Professor' });
    this.hasMany(models.Matricula, { foreignKey: 'turma_id' });
  }
}
