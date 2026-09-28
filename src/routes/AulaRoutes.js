import { Router } from 'express';
import AulaController from '../controllers/AulaController';
import loginRequired from '../middlewares/loginRequired';
import checkRole from '../middlewares/checkRole';

const router = new Router({ mergeParams: true });

router.use(loginRequired);

router.get('/', checkRole(['ADMIN', 'PROFESSOR', 'ALUNO']), AulaController.index);
router.post('/', checkRole(['ADMIN', 'PROFESSOR']), AulaController.store);

export default router;
