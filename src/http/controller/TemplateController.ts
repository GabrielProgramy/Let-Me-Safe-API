import { Request, Response } from 'express';
import { Mustache } from 'mustache';
import fs from 'fs';
import { nodemailer } from 'nodemailer';
import { getRepository } from 'typeorm';
import { User } from '../../database/entities/User';

export async function sendPasswordResetEmail(req: Request, res: Response) {
	const userId = req.params.id;

	const userRepository = getRepository(User);
	const user = await userRepository.findOne(userId);

	if (!user) {
		return res.status(404).json({ message: 'Usuário não encontrado!' });
	}

	const template = fs.readFileSync('src/utils/template.mustache', 'utf-8');

	const data = {
		title: 'Bem-vindo a Let Me Safe!',
		heading:
			`Olá ${user.name}, aqui ` + 'está o seu código de recuperação de senha:',
	};
}
