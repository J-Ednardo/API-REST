import { Router } from 'express';
import TurmaController from '../controllers/TurmaController';
import loginRequired from '../middlewares/loginRequired';
import checkRole from '../middlewares/checkRole';

const router = new Router();

router.use(loginRequired, checkRole(['ADMIN', 'PROFESSOR']));

router.get('/', TurmaController.index);
router.get('/:id', TurmaController.show);
router.post('/', TurmaController.store);
router.put('/:id', TurmaController.update);
router.delete('/:id', TurmaController.delete);

export default router;
