import { Router } from 'express';
import PeriodoLetivoController from '../controllers/PeriodoLetivoController';
import loginRequired from '../middlewares/loginRequired';
import checkRole from '../middlewares/checkRole';

const router = new Router();

router.use(loginRequired, checkRole(['ADMIN']));

router.get('/', PeriodoLetivoController.index);
router.get('/:id', PeriodoLetivoController.show);
router.post('/', PeriodoLetivoController.store);
router.put('/:id', PeriodoLetivoController.update);
router.delete('/:id', PeriodoLetivoController.delete);

export default router;
