import { nodemailer } from 'nodemailer';

export default class EmailService {
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

	async sendEmail(to: string, subject: string, text: string) {
		const mailOptions = {
			from: process.env.MAIL_FROM,
			to,
			subject,
			text,
		};

		return await this.transporter.sendMail(mailOptions);
	}

	// 	if (error) {
	// 		console.log(error);
	// 	} else {
	// 		console.log('Email sent: ' + info.response);
	// 	}
	// }
}

// const mailOptions = {
// 	from: process.env.MAIL_FROM,
// 	to: process.env.MAIL_TO,
// 	subject: 'Sending Email using Node.js',
// 	text: `Olá,\n\nPara redefinir sua senha, clique no seguinte link: http://localhost:3000/reset-password/${token}\n\nSe você não solicitou a redefinição da sua senha, ignore este e-mail.\n\nAtenciosamente,\nEquipe de suporte do sistema.`,
// };
