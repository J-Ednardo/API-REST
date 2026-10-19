import { Router } from 'express';
import PeriodoLetivoController from '../controllers/PeriodoLetivoController';
import loginRequired from '../middlewares/loginRequired';
import checkRole from '../middlewares/checkRole';

const router = new Router();

router.use(loginRequired);

router.get('/', checkRole(['ADMIN', 'PROFESSOR']), PeriodoLetivoController.index);
router.get('/:id', checkRole(['ADMIN', 'PROFESSOR']), PeriodoLetivoController.show);
router.post('/', checkRole(['ADMIN']), PeriodoLetivoController.store);
router.put('/:id', checkRole(['ADMIN']), PeriodoLetivoController.update);
router.delete('/:id', checkRole(['ADMIN']), PeriodoLetivoController.delete);

export default router;
