import { Request, Response } from 'express';
import { Mustache } from 'mustache';
import fs from 'fs';
import nodemailer from 'nodemailer';

export async function sendPasswordResetEmail(req: Request, res: Response) {
	const email = req.body.email;

	const template = fs.readFileSync('./reset-password-email.mustache', 'utf-8');

	const resetToken = 'some-random-token';

	const resetLink = `https://example.com/reset-password?email=${email}&token=${resetToken}`;

	const data = {
		name: email,
		resetLink: resetLink,
	};

	const html = Mustache.render(template, data);

	const transporter = nodemailer.createTransport({
		host: 'smtp.example.com',
		port: 587,
		auth: {
			user: 'user@example.com',
			pass: 'password',
		},
	});

	await transporter.sendMail({
		from: 'site@example.com',
		to: email,
		subject: 'Redefinição de senha Let Me Safe',
		html: html,
	});

	res.send('E-mail de recuperação de senha enviado com sucesso!');
}
