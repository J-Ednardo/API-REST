import { Router } from 'express';
import FrequenciaController from '../controllers/FrequenciaController';
import loginRequired from '../middlewares/loginRequired';
import checkRole from '../middlewares/checkRole';

const router = new Router({ mergeParams: true });

router.use(loginRequired, checkRole(['ADMIN', 'PROFESSOR']));

router.post('/', FrequenciaController.storeBatch);
router.put('/:id', FrequenciaController.update);

export default router;
