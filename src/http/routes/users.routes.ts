import { Router } from 'express';
import UsersController from '../controller/UsersController';
import { verifyJWT } from '../middleware/verifyJWT';
import uploadFile from '../middleware/avatarUpload';

const usersRoutes = Router();
const controller = new UsersController();

usersRoutes.post('/auth', controller.authenticateUser);
usersRoutes.post('/auth/google', controller.authenticateGoogle);
usersRoutes.post('/', controller.createUser);
usersRoutes.put('/me', verifyJWT, uploadFile, controller.updateUser);
usersRoutes.get('/:userId', verifyJWT, controller.findUser);
usersRoutes.post('/forgot', controller.sendResetToken);
usersRoutes.post('/reset-password', controller.resetPassword);

export default usersRoutes;
//Invalid login: 535-5.7.8 Username and Password not accepted. Learn more at\n535 5.7.8  https://support.google.com/mail/?p=BadCredentials l2-20020acabb02000000b003896df086b0sm5673397oif.15 - gsmtp
