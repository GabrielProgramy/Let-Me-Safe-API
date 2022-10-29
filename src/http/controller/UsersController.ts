import { Request, Response } from 'express'
import { Users } from '../../database/entities/User'
import UsersService from '../../service/UsersService'

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
      console.error(error)
      return res.status(400).json({ message: error.message })
    }
  }

  async findUser(req: Request, res: Response): Promise<Response> {
    try {
      const email = req.body.email

      const user = await UsersController.usersService.findUser(email)

      return res.status(200).json(user)
    } catch (error) {
      return res.status(404).json({ message: error.message })
    }
  }
}
