import 'reflect-metadata'
import express, { Request } from 'express'
import helmet from 'helmet'
import { postgresConnection } from './database/connection'
import usersRoutes from './http/routes/users.routes'
import ocurrenceRoute from './http/routes/ocurrences.routes'
import contactsRoutes from './http/routes/contacts.routes'

postgresConnection.initialize().then(() => {
	const app = express()

	app.use(helmet())
	app.use(express.json())

	app.use('/users', usersRoutes);
	app.use('/contacts', contactsRoutes)
	app.use('/ocurrences', ocurrenceRoute)

	app.get('/redirect', (req: Request, res) => {
		const url = req.params.url

		res.redirect(url)
	})

	app.listen(3000, () => console.log('🚀 Listening on port 3000'))
})
