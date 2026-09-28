import { Router } from 'express';
import tokenController from '../controllers/TokenController';

import validateRequest from '../middlewares/validateRequest';
import { tokenSchema } from '../schemas/tokenSchema';

const router = new Router();

router.post('/', validateRequest(tokenSchema), tokenController.store);

export default router;
