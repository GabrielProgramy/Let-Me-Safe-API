import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm'
import { randomUUID } from 'node:crypto'
import Address from './Address'
// import { Ocurrences } from './Ocurrences'

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

	confirmPassword: string

	@Column()
	phone?: string

	@Column({ nullable: true })
	avatar?: string

	@Column({ nullable: true })
	address_id?: string

	@OneToOne(() => Address)
	address?: Address

	// @OneToMany(() => Ocurrences, (ocurrence) => ocurrence.user)
	// ocurrences?: Ocurrences[]

	constructor() {
		if (!this.id) {
			this.id = randomUUID()
		}
	}
}
