import { Router } from 'express';
import alunoController from '../controllers/AlunoController';
import loginRequired from '../middlewares/loginRequired';

import validateRequest from '../middlewares/validateRequest';
import { alunoStoreSchema, alunoUpdateSchema } from '../schemas/alunoSchema';

const router = new Router();

router.get('/', alunoController.index);
router.post('/', loginRequired, validateRequest(alunoStoreSchema), alunoController.store);
router.put('/:id', loginRequired, validateRequest(alunoUpdateSchema), alunoController.update);
router.get('/:id', alunoController.show);
router.delete('/:id', loginRequired, alunoController.delete);

export default router;
