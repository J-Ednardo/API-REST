import { Router } from 'express';
import loginRequired from '../middlewares/loginRequired';

import fotoController from '../controllers/FotoController';
import checkRole from '../middlewares/checkRole';

const router = new Router();

router.post('/', loginRequired, checkRole(['ADMIN', 'PROFESSOR']), fotoController.store);

export default router;
