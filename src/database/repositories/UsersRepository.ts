import { Repository } from 'typeorm'
import { postgresConnection } from '../connection'
import { Users } from '../entities/User'

export default class UsersRepository {
	private repository: Repository<Users>

	constructor() {
		this.repository = postgresConnection.getRepository('users')
	}

	async insertUsers(user: Users): Promise<Users> {
		const newUser = this.repository.create(user)

		return this.repository.save(newUser)
	}

	async findUserById(id: string): Promise<Users | undefined> {
		const user = await this.repository.findOneBy({
			id
		})
		return user
	}

	async findUserByEmail(email: string): Promise<Users | undefined> {
		const user = await this.repository.findOneBy({
			email
		})
		return user
	}

	async updateUser({ id, ...user }: Users): Promise<Users> {
		const updateUser = await this.repository.createQueryBuilder().update(user).where({
			id
		}).returning('*').execute()

		return updateUser.raw[0]
	}
}
