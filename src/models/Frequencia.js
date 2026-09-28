import Sequelize, { Model } from 'sequelize';

export default class Frequencia extends Model {
  static init(sequelize) {
    super.init({
      presente: Sequelize.BOOLEAN,
    }, {
      sequelize,
      tableName: 'frequencias',
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Aula, { foreignKey: 'aula_id' });
    this.belongsTo(models.Matricula, { foreignKey: 'matricula_id' });
  }
}
