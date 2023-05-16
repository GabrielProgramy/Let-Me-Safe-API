import { Repository } from 'typeorm'
import { postgresConnection } from '../connection'
import { Users } from '../entities/User'

interface User extends Omit<Users, 'birthDate'> {}

export default class UsersRepository {
	private repository: Repository<Users>

	constructor() {
		this.repository = postgresConnection.getRepository('users')
	}

	async insertUsers(user: Users): Promise<Users> {
		const newUser = this.repository.create(user)

		return this.repository.save(newUser)
	}


	async findUser(options: Object): Promise<Users | undefined> {
		const user = await this.repository.findOneBy(options)
		return user
	}

	async updateUser({ id, ...user }: User): Promise<Users> {
		const updateUser = await this.repository.createQueryBuilder().update(user).where({
			id
		}).returning('*').execute()

		return updateUser.raw[0]
	}
}
