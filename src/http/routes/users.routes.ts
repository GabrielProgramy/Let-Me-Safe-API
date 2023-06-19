import { Router } from 'express'
import UsersController from '../controller/UsersController'
import { verifyJWT } from '../middleware/verifyJWT'
import uploadFile from '../middleware/avatarUpload'

const usersRoutes = Router()
const controller = new UsersController()

usersRoutes.get('/:userId', verifyJWT, controller.findUser)
usersRoutes.post('/auth', controller.authenticateUser)
usersRoutes.post('/auth/google', controller.authenticateGoogle)
usersRoutes.post('/auth/refresh', controller.refreshToken)
usersRoutes.post('/', controller.createUser)
usersRoutes.put('/me', verifyJWT, uploadFile, controller.updateUser)
usersRoutes.post('/forgot', controller.sendResetToken)
usersRoutes.patch('/reset-password', verifyJWT, controller.resetPassword)

export default usersRoutes
