import express from 'express';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config();

import './database/index.js';
import homeRoutes from './routes/homeRoutes.js';
import userRoutes from './routes/UserRoutes.js';
import tokenRoutes from './routes/TokenRoutes.js';
import alunoRoutes from './routes/AlunoRoutes.js';
import fotoRoutes from './routes/FotoRoutes.js';

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(express.static(resolve(__dirname, 'uploads')))
  }

  routes() {
    this.app.use('/', homeRoutes);
    this.app.use('/users/', userRoutes);
    this.app.use('/tokens/', tokenRoutes);
    this.app.use('/alunos/', alunoRoutes);
    this.app.use('/fotos/', fotoRoutes);
  }
}

export default new App().app;
