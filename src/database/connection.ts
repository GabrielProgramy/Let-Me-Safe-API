import { DataSource } from 'typeorm'

import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

export const postgresConnection = new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST,
	port: +process.env.DB_PORT,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	entities: [`${__dirname}/**/entities/*.{ts, js}`],
	migrations: [`${__dirname}/**/migrations/*.{ts, js}`],
})
