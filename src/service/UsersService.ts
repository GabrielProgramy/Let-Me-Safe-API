import fs from 'node:fs'
import moment from 'moment'
import path from 'node:path'
import fetch from 'node-fetch'
import Mustache from 'mustache'
import nodemailer from 'nodemailer'
import { Algorithm, Secret, sign } from 'jsonwebtoken'
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage'

import UsersRepository from '../database/repositories/UsersRepository'
import { Users } from '../database/entities/User'
import { storage } from '../utils/firebase'
import { randomBytes } from 'node:crypto'



export default class UsersService {
	private usersRepository: UsersRepository

	constructor() {
		this.usersRepository = new UsersRepository()
	}

	private generateToken(user: { id: string, email?: string, firstName: string, lastName: string, avatar?: string }, reset?: boolean): string {
		return sign({
			sub: user.id,
			iss: process.env.JWT_ISSUER,
			aud: reset ? process.env.JWT_AUDIENCE_RESET : process.env.JWT_AUDIENCE,
			email: user.email && user.email,
			name: `${user.firstName} ${user.lastName}`,
			avatar: user.avatar && user.avatar,
		}, process.env.JWT_SECRET as Secret, {
			algorithm: process.env.JWT_ALGORITHM as Algorithm,
			expiresIn: reset ? process.env.JWT_EXPIRATION_RESET : process.env.JWT_EXPIRATION
		})
	}

	async create(user: Users): Promise<Users> {
		const alreadyExistsUser = await this.usersRepository.findUser({
			email: user.email
		})
		// const years = Number(moment(user.birthDate, moment.HTML5_FMT.DATETIME_LOCAL).fromNow().match(/\d/g).join(''))

		if (alreadyExistsUser) throw new Error('User already exists!')
		// if (years < 18) throw new Error('User dont permission!')

		return this.usersRepository.insertUsers(user)
	}

	async findUser(options: Object): Promise<Users> {
		const user = await this.usersRepository.findUser(options)
		console.log(user)

		if (!user) throw new Error('User not found!')

		return user
	}

	async updateUser(user: Users, avatar?: Express.Multer.File): Promise<Users> {
		const existingUser = await this.findUser({ id: user.id })

		let birthDate = moment(existingUser.birthDate)

		if (!birthDate.isSame(moment(user.birthDate))) birthDate = moment(user.birthDate.setDate(user.birthDate.getDate() + 1))

		if (avatar) {
			const avatarRef = ref(storage, `${avatar.filename}`)
			await uploadBytes(avatarRef, fs.readFileSync(avatar.path))
			const avatarPath = await getDownloadURL(avatarRef)

			if (avatarPath) fs.unlinkSync(avatar.path)

			user.avatar = avatarPath
		}



		return this.usersRepository.updateUser({
			birthDate: birthDate.format('YYYY-MM-DD'),
			...user,
		})
	}


	async authenticateUser(email: string, password: string): Promise<string> {
		const user = await this.findUser({ email })

		if (user.password !== password)
			throw new Error('Email or Password invalid!')

		const token = this.generateToken({
			id: user.id,
			email,
			firstName: user.firstName,
			avatar: user.avatar,
			lastName: user.lastName
		})

		return token
	}

	async authenticateGoogle(oAuthtoken: string): Promise<string> {
		// https://www.googleapis.com/plus/v1/people/me
		const retur = await fetch(
			"https://www.googleapis.com/userinfo/v2/me",
			{
				headers: { Authorization: `Bearer ${oAuthtoken}` },
			}
		)

		const data = await retur.json()

		let user = await this.usersRepository.findUser({ email: data.email })

		if (!user) {
			user = await this.usersRepository.insertUsers({
				email: data.email,
				firstName: data.given_name,
				lastName: data.family_name,
				password: randomBytes(16).toString('hex'),
				avatar: data.picture,
			})

		}


		const token = this.generateToken({
			id: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			avatar: user.avatar,
		})

		return token
	}

	async refreshToken(token: string): Promise<string> {
		const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())

		const user = await this.findUser({ id: payload.sub })

		const newToken = this.generateToken({
			id: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			avatar: user.avatar,
		})

		return newToken
	}

	async sendEmail(email: string): Promise<void> {
		const user = await this.usersRepository.findUser({ email })

		if (!user) return

		const template = fs.readFileSync(
			path.resolve('src/utils/templates/template.mustache'),
			'utf-8',
		)

		const resetToken = this.generateToken({
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
		}, true)

		const resetLink = `http://192.168.0.120:3000/redirect?url=exp://192.168.0.120:19000/--/letmesafe/reset?token=${resetToken}`

		const html = Mustache.render(template, {
			name: user.firstName,
			resetLink: resetLink,
		})

		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'contato.letmesafe@gmail.com',
				pass: 'vojctzzfdzhbyfab',
			}
		})

		const mailOptions = {
			from: 'contato.letmesafe@gmail.com',
			to: email,
			subject: 'Reset de senha Let Me Safe',
			html: html,
		}

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) console.error(error)
			else console.log('E-mail enviado com sucesso!', info.accepted)
		})
	}

	async resetPassword(password, userId): Promise<Users> {
		const user = await this.findUser({ id: userId })

		user.password = password

		return await this.updateUser(user)
	}
}
