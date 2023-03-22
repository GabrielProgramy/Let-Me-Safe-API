import fs from 'node:fs'
import moment from 'moment'
import { Algorithm, Secret, sign } from 'jsonwebtoken'
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage'

import { Users } from '../database/entities/User'
import UsersRepository from '../database/repositories/UsersRepository'
import AddressService from './AddressService'
import { viaCepAPI } from '../utils/viaCepAPI'
import { storage } from '../utils/firebase'



export default class UsersService {
	private usersRepository: UsersRepository
	private addressService: AddressService

	constructor() {
		this.usersRepository = new UsersRepository()
		this.addressService = new AddressService()
	}

	private generateToken(user: {
		id: string, email: string, firstName: string, lastName: string
	}) {
		return sign({
			sub: user.id,
			iss: process.env.JWT_ISSUER,
			aud: process.env.JWT_AUDIENCE,
			email: user.email,
			name: `${user.firstName} ${user.lastName}`
		}, process.env.JWT_SECRET as Secret, {
			algorithm: process.env.JWT_ALGORITHM as Algorithm,
			expiresIn: process.env.JWT_EXPIRATION
		})
	}

	async create(user: Users): Promise<Users> {
		const alreadyExistsUser = await this.usersRepository.findUserByOptions({
			email: user.email
		})
		const years = Number(moment(user.birthDate, moment.HTML5_FMT.DATETIME_LOCAL).fromNow().match(/\d/g).join(''))

		if (alreadyExistsUser) throw new Error('User already exists!')
		if (years < 18) throw new Error('User dont permission!')

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

	async updateUser(user: Users, address: string, avatar: Express.Multer.File): Promise<Users> {
		await this.findUserById(user.id)

		if (avatar) {
			const avatarRef = ref(storage, `${avatar.filename}`)
			await uploadBytes(avatarRef, fs.readFileSync(avatar.path))
			const avatarPath = await getDownloadURL(avatarRef)

			if (avatarPath) fs.unlinkSync(avatar.path)

			user.avatar = avatarPath
		}


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

		const token = this.generateToken({
			id: user.id,
			email,
			firstName: user.firstName,
			lastName: user.lastName
		})

		return token
	}

	async authenticateGoogle(oAuthtoken: string): Promise<string> {
		const { data } = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?oauth_token=${oAuthtoken}`)


		console.log(data)
		// const user = await this.findUser({ email })


		// const token = this.generateToken({
		// 	id: user.id,
		// 	email,
		// 	firstName: user.firstName,
		// 	lastName: user.lastName
		// })

		// return token

		const a: Promise<string> = new Promise((resolve, reject) => {
			resolve('teste')
		})
		return a
	}
}
