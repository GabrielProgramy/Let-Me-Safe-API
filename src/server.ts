import 'reflect-metadata'
import express from 'express'
import helmet from 'helmet'
import { postgresConnection } from './database/connection'
import usersRoutes from './http/routes/users.routes'
import ocurrenceRoute from './http/routes/ocurrences.routes'
import communityRouter from './http/routes/community.routes'

postgresConnection.initialize().then(() => {
	const app = express()

	app.use(helmet())
	app.use(express.json())

	app.use('/users', usersRoutes)
	app.use('/ocurrences', ocurrenceRoute)
	app.use('/community', communityRouter)

	app.listen(3000, () => console.log('🚀 Listening on port 3000'))
})
