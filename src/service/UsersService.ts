import { Algorithm, Secret, sign } from 'jsonwebtoken'
import { Users } from '../database/entities/User'
import UsersRepository from '../database/repositories/UsersRepository'
import AddressService from './AddressService'
import { viaCepAPI } from '../utils/viaCepAPI'

export default class UsersService {
	private usersRepository: UsersRepository
	private addressService: AddressService

	constructor() {
		this.usersRepository = new UsersRepository()
		this.addressService = new AddressService()
	}

	async create(user: Users): Promise<Users> {
		const alreadyExistsUser = await this.usersRepository.findUserByOptions({
			email: user.email
		})

		if (alreadyExistsUser) throw new Error('User already exists!')
		if (user.password !== user.confirmPassword) throw new Error('Password not equals')

		return this.usersRepository.insertUsers(user)
	}

	async findUserById(id: string): Promise<Users> {
		const user = await this.usersRepository.findUserById(id)

		if (!user) throw new Error('User not found!')

		return user
	}

	async findUser(options: Object): Promise<Users> {
		const user = await this.usersRepository.findUserByOptions(options)

		if (!user) throw new Error('User not found!')

		return user
	}

	async updateUser(user: Users, address: string): Promise<Users> {
		await this.findUser(user.id)

		if (address) {
			const existsAddress = await this.addressService.findByCep(address)
			let addressId: string

			if (!existsAddress) {
				const { cep, bairro, localidade, logradouro, complemento, uf } = await viaCepAPI(address)

				const newAddress = await this.addressService.create({
					cep: cep.split('-').join(''),
					district: bairro,
					city: localidade,
					street: logradouro,
					state: uf,
					complement: complemento
				})

				addressId = newAddress.id
			}

			addressId = addressId ?? existsAddress.id

			user.address_id = addressId
		}

		return await this.usersRepository.updateUser(user)
	}

	async authenticateUser(email: string, password: string): Promise<string> {
		const user = await this.findUser({ email })

		if (user.password !== password) throw new Error('Email or Password invalid!')

		const token = sign({
			sub: user.id,
			iss: process.env.JWT_ISSUER,
			aud: process.env.JWT_AUDIENCE,
			email: user.email,
			name: `${user.firstName} ${user.lastName}`
		}, process.env.JWT_SECRET as Secret, {
			algorithm: process.env.JWT_ALGORITHM as Algorithm,
			expiresIn: process.env.JWT_EXPIRATION
		})

		return token
	}
}
