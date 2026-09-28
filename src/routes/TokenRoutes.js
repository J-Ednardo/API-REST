import { Router } from 'express';
import tokenController from '../controllers/TokenController';

import validateRequest from '../middlewares/validateRequest';
import { tokenSchema } from '../schemas/tokenSchema';
import { loginLimiter } from '../middlewares/rateLimiter';

const router = new Router();

router.post('/', loginLimiter, validateRequest(tokenSchema), tokenController.store);

export default router;
