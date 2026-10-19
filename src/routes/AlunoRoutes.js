import { Router } from 'express';
import alunoController from '../controllers/AlunoController';
import loginRequired from '../middlewares/loginRequired';

import validateRequest from '../middlewares/validateRequest';
import { alunoStoreSchema, alunoUpdateSchema } from '../schemas/alunoSchema';

import checkRole from '../middlewares/checkRole';

const router = new Router();

const professorAdmin = checkRole(['ADMIN', 'PROFESSOR']);
const onlyAdmin = checkRole(['ADMIN']);

router.get('/', loginRequired, professorAdmin, alunoController.index);
router.post('/', loginRequired, onlyAdmin, validateRequest(alunoStoreSchema), alunoController.store);
router.put('/:id', loginRequired, onlyAdmin, validateRequest(alunoUpdateSchema), alunoController.update);
router.get('/:id', loginRequired, professorAdmin, alunoController.show);
router.delete('/:id', loginRequired, onlyAdmin, alunoController.delete);

// Rota de histórico escolar (ALUNO pode acessar o seu próprio, ADMIN/PROFESSOR acessam qualquer)
router.get('/:id/historico', loginRequired, checkRole(['ADMIN', 'PROFESSOR', 'ALUNO']), alunoController.historico);

export default router;
