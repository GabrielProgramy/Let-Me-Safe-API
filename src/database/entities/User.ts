import { Column, Entity, PrimaryColumn } from 'typeorm'
import { randomUUID } from 'node:crypto'

@Entity('users')
export class Users {
	@PrimaryColumn()
	id?: string

	@Column()
	firstName: string

	@Column()
	lastName: string

	@Column()
	email: string

	@Column()
	password: string

	@Column()
	phone?: string

	@Column({ nullable: true })
	avatar?: string

	@Column({ nullable: true })
	birthDate?: Date

	@Column({ nullable: true })
	addressId?: string

	constructor() {
		if (!this.id) {
			this.id = randomUUID()
		}
	}
}
