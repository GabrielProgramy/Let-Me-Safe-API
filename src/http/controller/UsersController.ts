import { Request, Response } from 'express';
import { Users } from '../../database/entities/User';
import UsersService from '../../service/UsersService';
import { RequestAlter } from '../middleware/verifyJWT';
import {
	authUserSchema,
	createUserSchema,
	updateUserSchema,
} from './validations/usersValidations';
import Joi from 'joi';

export default class UsersController {
	private static usersService: UsersService;

	constructor() {
		UsersController.usersService = new UsersService();
	}

	async createUser(req: Request, res: Response): Promise<Response> {
		try {
			const user = await createUserSchema.validateAsync(req.body);

			const newUser = await UsersController.usersService.create(user);

			return res.status(201).json(newUser);
		} catch (error) {
			console.error(error.message);
			if (error instanceof Joi.ValidationError)
				return res.status(422).json({ message: error.message });
			return res.status(400).json({ message: error.message });
		}
	}

	async findUser(req: RequestAlter, res: Response): Promise<Response> {
		try {
			let id = req.params.userId;

			if (id === 'me') id = req.user.sub as string;

			const user = await UsersController.usersService.findUserById(id);

			return res.status(200).json(user);
		} catch (error) {
			return res.status(404).json({ message: error.message });
		}
	}

	async updateUser(req: RequestAlter, res: Response): Promise<Response> {
		try {
			const userId = req.user.sub;
			const avatar = req.file;

			const { cep, ...user } = await updateUserSchema.validateAsync(req.body);

			const updateUser = await UsersController.usersService.updateUser(
				{ ...user, id: userId },
				cep,
				avatar,
			);

			return res.status(200).json(updateUser);
		} catch (error) {
			console.log(error);
			if (error instanceof Joi.ValidationError)
				return res.status(422).json({ message: error.message });
			return res.status(404).json({ message: error.message });
		}
	}

	async authenticateUser(req: Request, res: Response): Promise<Response> {
		try {
			const { email, password } = await authUserSchema.validateAsync(req.body);

			const token = await UsersController.usersService.authenticateUser(
				email,
				password,
			);

			res.status(200).json({ token });
		} catch (err) {
			console.error(err);
			return res.status(404).json({ message: err.message });
		}
	}

	async authenticateGoogle(req: Request, res: Response): Promise<Response> {
		try {
			const oAuthtoken = req.body.token;

			const token = await UsersController.usersService.authenticateGoogle(
				oAuthtoken,
			);

			res.status(200).json({ token });
		} catch (err) {
			console.error(err);
			return res.status(404).json({ message: err.message });
		}
	}

	async sendResetToken(req: Request, res: Response): Promise<Response> {
		try {
			const email = req.body.email;

			await UsersController.usersService.sendEmail(email);

			return res.status(200).end();
		} catch (error) {
			return res.status(404).json({ message: error.message });
		}
	}
}
