import { Request, Response } from 'express';
import { Mustache } from 'mustache';
import fs from 'fs';
import nodemailer from 'nodemailer';

export async function sendPasswordResetEmail(req: Request, res: Response) {
	const email = req.body.email;

	const template = fs.readFileSync('./template.mustache', 'utf-8');

	const resetToken = 'some-random-token';

	const resetLink = `https://example.com/reset-password?email=${email}&token=${resetToken}`;

	const data = {
		name: email,
		resetLink: resetLink,
	};

	const html = Mustache.render(template, data);

	const transporter = nodemailer.createTransport({
		host: 'smtp.ethereal.email',
		port: 587,
		auth: {
			user: 'trever.bailey39@ethereal.email',
			pass: 'FK8sETDnX1hfswgqn5',
		},
	});

	await transporter.sendMail({
		from: 'trever.bailey39@ethereal.email',
		to: email,
		subject: 'Redefinição de senha Let Me Safe',
		html: html,
	});

	res.send('E-mail de recuperação de senha enviado com sucesso!');
}
