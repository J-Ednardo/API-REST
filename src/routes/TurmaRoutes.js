import { Router } from 'express';
import TurmaController from '../controllers/TurmaController';
import loginRequired from '../middlewares/loginRequired';
import checkRole from '../middlewares/checkRole';

const router = new Router();

router.use(loginRequired);

router.get('/', checkRole(['ADMIN', 'PROFESSOR']), TurmaController.index);
router.get('/:id', checkRole(['ADMIN', 'PROFESSOR']), TurmaController.show);
router.post('/', checkRole(['ADMIN']), TurmaController.store);
router.put('/:id', checkRole(['ADMIN']), TurmaController.update);
router.delete('/:id', checkRole(['ADMIN']), TurmaController.delete);

export default router;
