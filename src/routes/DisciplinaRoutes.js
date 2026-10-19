import { Router } from 'express';
import DisciplinaController from '../controllers/DisciplinaController';
import loginRequired from '../middlewares/loginRequired';
import checkRole from '../middlewares/checkRole';

const router = new Router();

router.use(loginRequired);

router.get('/', checkRole(['ADMIN', 'PROFESSOR']), DisciplinaController.index);
router.get('/:id', checkRole(['ADMIN', 'PROFESSOR']), DisciplinaController.show);
router.post('/', checkRole(['ADMIN']), DisciplinaController.store);
router.put('/:id', checkRole(['ADMIN']), DisciplinaController.update);
router.delete('/:id', checkRole(['ADMIN']), DisciplinaController.delete);

export default router;
