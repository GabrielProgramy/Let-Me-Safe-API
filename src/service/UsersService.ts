import { Algorithm, Secret, sign } from 'jsonwebtoken'
import { Users } from '../database/entities/User'
import UsersRepository from '../database/repositories/UsersRepository'

export default class UsersService {
  private usersRepository: UsersRepository

  constructor() {
    this.usersRepository = new UsersRepository()
  }

  async create(user: Users): Promise<Users> {
    const alreadyExistsUser = await this.usersRepository.findUserByEmail(user.email)

    if (alreadyExistsUser) throw new Error('User already exists!')
    if (user.password !== user.confirmPassword) throw new Error('Password not equals')

    return this.usersRepository.insertUsers(user)
  }

  async findUser(id: string): Promise<Users> {
    const user = await this.usersRepository.findUserById(id)

    if (!user) throw new Error('User not found!')

    return user
  }

  async findUserByEmail(email: string): Promise<Users> {
    const user = await this.usersRepository.findUserByEmail(email)

    if (!user) throw new Error('User not found!')

    return user
  }

  async updateUser(user: Users): Promise<Users> {
    await this.findUser(user.id)

    return await this.usersRepository.updateUser(user)
  }

  async authenticateUser(email: string, password: string): Promise<string> {
    const user = await this.findUserByEmail(email)

    if (user.password !== password) throw new Error('Email or Password invalid!')

    const token = sign({
      sub: user.id,
      iss: process.env.JWT_ISSUER,
      aud: process.env.JWT_AUDIENCE,
      email: user.email,
      name: user.firstName
    }, process.env.JWT_SECRET as Secret, {
      algorithm: process.env.JWT_ALGORITHM as Algorithm,
      expiresIn: process.env.JWT_EXPIRATION
    })

    return token
  }
}
