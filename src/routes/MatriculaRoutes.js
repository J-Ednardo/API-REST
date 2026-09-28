import { Router } from 'express';
import MatriculaController from '../controllers/MatriculaController';
import loginRequired from '../middlewares/loginRequired';
import checkRole from '../middlewares/checkRole';

const router = new Router();

router.use(loginRequired);

router.get('/', checkRole(['ADMIN', 'PROFESSOR', 'ALUNO']), MatriculaController.index);
router.get('/:id', checkRole(['ADMIN', 'PROFESSOR', 'ALUNO']), MatriculaController.show);

router.post('/', checkRole(['ADMIN', 'PROFESSOR']), MatriculaController.store);
router.put('/:id', checkRole(['ADMIN', 'PROFESSOR']), MatriculaController.update);
router.delete('/:id', checkRole(['ADMIN', 'PROFESSOR']), MatriculaController.delete);

export default router;
