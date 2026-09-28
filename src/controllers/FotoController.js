import multer from 'multer';
import multerConfig from '../config/multerConfig.js';
import Foto from '../models/Foto';
import AppError from '../errors/AppError';

const upload = multer(multerConfig).single('foto');

class FotoController {
  async store(req, res) {
    return new Promise((resolve, reject) => {
      upload(req, res, async (error) => {
        if (error) {
          return reject(new AppError(error.code, 400, 'ERRO_UPLOAD'));
        }

        try {
          const { originalname, filename } = req.file;
          const { aluno_id } = req.body;

          const foto = await Foto.create({ originalname, filename, aluno_id });
          resolve(res.json(foto));
        } catch (e) {
          reject(new AppError('Aluno não existe', 404, 'NAO_ENCONTRADO'));
        }
      });
    });
  }
}

export default new FotoController();
