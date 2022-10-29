import { Users } from '../database/entities/User'
import UsersRepository from '../database/repositories/UsersRepository'

export default class UsersService {
  private usersRepository: UsersRepository

  constructor() {
    this.usersRepository = new UsersRepository()
  }

  async create(user: Users): Promise<Users> {
    const alreadyExistsUser = await this.usersRepository.findUser(user.email)

    if (alreadyExistsUser) throw new Error('User already exists!')

    return this.usersRepository.insertUsers(user)
  }

  async findUser(email: string): Promise<Users> {
    const user = await this.usersRepository.findUser(email)

    if (!user) throw new Error('User not found!')

    return user
  }
}
