import { Router } from 'express';
import loginRequired from '../middlewares/loginRequired';
import validateRequest from '../middlewares/validateRequest';
import { fotoSchema } from '../schemas/fotoSchema';

import fotoController from '../controllers/FotoController';
import checkRole from '../middlewares/checkRole';

const router = new Router();

router.post('/', loginRequired, checkRole(['ADMIN', 'PROFESSOR']), validateRequest(fotoSchema), fotoController.store);


export default router;
