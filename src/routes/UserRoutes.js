import { Router } from 'express';
import userController from '../controllers/UserController';
import loginRequired from '../middlewares/loginRequired';

const router = new Router();

router.get('/', loginRequired, userController.index);
router.post('/', userController.store);
router.get('/:id', userController.show);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

export default router;

/*
index -> lista todos os usuários -> get
store/create -> cria um novo usuário -> post
delete -> apaga um usuário -> delete
show -> mostra 1 usuário -> get
update -> atualiza um usuário -> patch ou put
*/
