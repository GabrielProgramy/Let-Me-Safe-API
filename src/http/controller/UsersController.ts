import { Request, Response } from 'express'
import { Users } from '../../database/entities/User'
import UsersService from '../../service/UsersService'
import { RequestAlter } from '../middleware/verifyJWT'

export default class UsersController {
  private static usersService: UsersService

  constructor() {
    UsersController.usersService = new UsersService()
  }

  async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const user: Users = req.body

      const newUser = await UsersController.usersService.create(user)

      return res.status(201).json(newUser)
    } catch (error) {
      console.error(error.message)
      return res.status(400).json({ message: error.message })
    }
  }

  async findUser(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.userId

      const user = await UsersController.usersService.findUser(id)

      return res.status(200).json(user)
    } catch (error) {
      return res.status(404).json({ message: error.message })
    }
  }

  async updateUser(req: RequestAlter, res: Response): Promise<Response> {
    try {
      const userId = req.user.sub
      const { cep, ...user } = req.body

      const updateUser = await UsersController.usersService.updateUser({ ...user, id: userId }, cep)

      return res.status(200).json(updateUser)
    } catch (error) {
      console.log(error)
      return res.status(404).json({ message: error.message })
    }
  }

  async authenticateUser(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body

      const token = await UsersController.usersService.authenticateUser(email, password)

      res.status(200).json({ token })
    } catch (err) {
      console.error(err)
      return res.status(404).json({ message: err.message })
    }
  }
}
