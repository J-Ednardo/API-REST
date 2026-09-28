import Sequelize, { Model } from 'sequelize';

export default class Disciplina extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      carga_horaria: Sequelize.INTEGER,
    }, {
      sequelize,
    });
    return this;
  }

  static associate(models) {
    this.hasMany(models.Turma, { foreignKey: 'disciplina_id' });
  }
}
