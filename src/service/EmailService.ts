import { nodemailer } from 'nodemailer';

export class EmailService {
	private transporter = nodemailer.createTransport({
		service: 'gmail',
		host: process.env.MAIL_HOST,
		port: process.env.MAIL_PORT,
		secure: false,
		auth: {
			user: process.env.MAIL_USER,
			pass: process.env.MAIL_PASS,
		},
	});

	// async sendMail(to: string, subject: string, body: string) {
	//     const message = await this.transporter.sendMail({
	//         from:
	// }
}
