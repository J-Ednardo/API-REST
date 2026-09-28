import { Router } from 'express';
import DisciplinaController from '../controllers/DisciplinaController';
import loginRequired from '../middlewares/loginRequired';
import checkRole from '../middlewares/checkRole';

const router = new Router();

router.use(loginRequired, checkRole(['ADMIN']));

router.get('/', DisciplinaController.index);
router.get('/:id', DisciplinaController.show);
router.post('/', DisciplinaController.store);
router.put('/:id', DisciplinaController.update);
router.delete('/:id', DisciplinaController.delete);

export default router;
