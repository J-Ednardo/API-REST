import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import { resolve } from 'path';
import cors from 'cors';
import helmet from 'helmet';
import delay from 'express-delay';

dotenv.config();

import './database/index.js';
import homeRoutes from './routes/homeRoutes.js';
import userRoutes from './routes/UserRoutes.js';
import tokenRoutes from './routes/TokenRoutes.js';
import alunoRoutes from './routes/AlunoRoutes.js';
import fotoRoutes from './routes/FotoRoutes.js';
import periodoLetivoRoutes from './routes/PeriodoLetivoRoutes.js';
import disciplinaRoutes from './routes/DisciplinaRoutes.js';
import turmaRoutes from './routes/TurmaRoutes.js';
import matriculaRoutes from './routes/MatriculaRoutes.js';
import errorHandler from './middlewares/errorHandler';

const whiteList = [
  'http://localhost:3000'
]

const corsOptions = {
  origin: function (origin, callback) {
    if(whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.app.use(cors(corsOptions));
    this.app.use(helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      crossOriginEmbedderPolicy: false,
    }));
    this.app.use(delay(500));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(express.static(resolve(__dirname, '..', 'uploads')));
  }

  routes() {
    this.app.use('/', homeRoutes);
    this.app.use('/users/', userRoutes);
    this.app.use('/tokens/', tokenRoutes);
    this.app.use('/alunos/', alunoRoutes);
    this.app.use('/fotos/', fotoRoutes);
    this.app.use('/periodos-letivos/', periodoLetivoRoutes);
    this.app.use('/disciplinas/', disciplinaRoutes);
    this.app.use('/turmas/', turmaRoutes);
    this.app.use('/matriculas/', matriculaRoutes);
  }

  exceptionHandler() {
    this.app.use(errorHandler);
  }
}

export default new App().app;
