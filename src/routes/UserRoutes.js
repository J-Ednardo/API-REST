import { Router } from 'express';
import userController from '../controllers/UserController';
import loginRequired from '../middlewares/loginRequired';

import validateRequest from '../middlewares/validateRequest';
import { userStoreSchema, userUpdateSchema } from '../schemas/userSchema';

const router = new Router();

router.post('/', validateRequest(userStoreSchema), userController.store);
router.put('/', loginRequired, validateRequest(userUpdateSchema), userController.update);
router.delete('/', loginRequired, userController.delete);

export default router;

/*
index -> lista todos os usuários -> get
store/create -> cria um novo usuário -> post
delete -> apaga um usuário -> delete
show -> mostra 1 usuário -> get
update -> atualiza um usuário -> patch ou put
*/
