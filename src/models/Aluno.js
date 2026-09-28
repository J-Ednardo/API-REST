import Sequelize, { Model } from 'sequelize';

export default class Aluno extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            len: {
              args: [3, 255],
              msg: 'O campo nome deve ter entre 3 e 255 caracteres',
            },
          },
        },
        sobrenome: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            len: {
              args: [3, 255],
              msg: 'O campo sobrenome deve ter entre 3 e 255 caracteres',
            },
          },
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: {
            msg: 'Email já existe',
          },
          validate: {
            isEmail: {
              msg: 'Email inválido',
            },
          },
        },
        idade: {
          type: Sequelize.INTEGER,
          allowNull: false,
          validate: {
            isInt: {
              msg: 'Idade precisa ser um número inteiro',
            },
          },
        },
      },
      {
        sequelize,
        paranoid: true,
        deletedAt: 'deleted_at',
      },
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Foto, { foreignKey: 'aluno_id' });
    this.hasMany(models.Matricula, { foreignKey: 'aluno_id' });
  }
}
