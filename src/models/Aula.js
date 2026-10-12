import Sequelize, { Model } from 'sequelize';

export default class Aula extends Model {
  static init(sequelize) {
    super.init({
      data: Sequelize.DATEONLY,
      conteudo: Sequelize.STRING,
    }, {
      sequelize,
      tableName: 'aulas',
      indexes: [
        {
          unique: true,
          fields: ['turma_id', 'data'],
        },
      ],
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Turma, { foreignKey: 'turma_id' });
    this.hasMany(models.Frequencia, { foreignKey: 'aula_id' });
  }
}
