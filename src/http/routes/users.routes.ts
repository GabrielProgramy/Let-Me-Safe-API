import { Router } from 'express'
import UsersController from '../controller/UsersController'

const usersRoutes = Router()
const controller = new UsersController()

usersRoutes.post('/users', controller.createUser)
usersRoutes.get('/users', controller.findUser)

export default usersRoutes
