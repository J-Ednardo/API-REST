import Sequelize, { Model } from "sequelize";

export default class PeriodoLetivo extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { len: [3, 255] }
      },
      data_inicio: Sequelize.DATEONLY,
      data_fim: Sequelize.DATEONLY,
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'ABERTO'
      }
    }, {
      sequelize,
      tableName: 'periodos_letivos'
    });
    return this;
  }

  static associate(models) {
    this.hasMany(models.Turma, { foreignKey: 'periodo_id' });
  }
}
