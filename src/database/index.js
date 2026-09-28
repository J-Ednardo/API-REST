import Sequelize from "sequelize";
import databaseConfig from '../config/database';
import Aluno from '../models/Aluno';
import User from "../models/User";
import Foto from "../models/Foto";
import PeriodoLetivo from "../models/PeriodoLetivo";
import Disciplina from "../models/Disciplina";
import Turma from "../models/Turma";
import Matricula from "../models/Matricula";

const models = [Aluno, User, Foto, PeriodoLetivo, Disciplina, Turma, Matricula];

const conection = new Sequelize(databaseConfig);

models.forEach(model => model.init(conection));
models.forEach(model => model.associate && model.associate(conection.models));
