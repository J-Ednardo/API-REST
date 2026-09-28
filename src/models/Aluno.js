import Sequelize, { Model } from "sequelize";

export default class Aluno extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 255],
            msg: 'O campo nome deve ter entre 3 e 255 caracteres'
          }
        }
      },
      sobrenome: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 255],
            msg: 'O campo sobrenome deve ter entre 3 e 255 caracteres'
          }
        }
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          msg: 'Email já existe'
        },
        validate: {
          isEmail: {
            msg: 'Email inválido'
          }
        }
      },
      idade: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: 'Idade precisa ser um número inteiro'
          }
        }
      },
      nota1: {
        type: Sequelize.FLOAT,
        allowNull: true,
        validate: {
          isFloat: {
            msg: 'Nota 1 precisa ser um número'
          },
          min: {
            args: [0],
            msg: 'Nota 1 não pode ser menor que 0',
          },
          max: {
            args: [10],
            msg: 'Nota 1 não pode ser maior que 10',
          }
        }
      },
      nota2: {
        type: Sequelize.FLOAT,
        allowNull: true,
        validate: {
          isFloat: {
            msg: 'Nota 2 precisa ser um número'
          },
          min: {
            args: [0],
            msg: 'Nota 2 não pode ser menor que 0',
          },
          max: {
            args: [10],
            msg: 'Nota 2 não pode ser maior que 10',
          }
        }
      },
      nota3: {
        type: Sequelize.FLOAT,
        allowNull: true,
        validate: {
          isFloat: {
            msg: 'Nota 3 precisa ser um número'
          },
          min: {
            args: [0],
            msg: 'Nota 3 não pode ser menor que 0',
          },
          max: {
            args: [10],
            msg: 'Nota 3 não pode ser maior que 10',
          }
        }
      },
      media_final: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
      situacao: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      faltas: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          isInt: {
            msg: 'Faltas precisa ser um número inteiro'
          },
          min: {
            args: [0],
            msg: 'Faltas não pode ser menor que 0'
          }
        }
      }
    },
    {
      sequelize,
      paranoid: true,
      deletedAt: 'deleted_at',
    });

    this.addHook('beforeDestroy', async (aluno) => {
      // Mutaciona o email para liberar o original
      aluno.email = `deleted_${Date.now()}_${aluno.email}`;
      await aluno.save({ hooks: false }); // salva o novo email sem validar triggers normais
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.Foto, { foreignKey: 'aluno_id' });
  }
}
