import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm'
import { randomUUID } from 'node:crypto'
import Address from './Address'
import { Ocurrences } from './Ocurrences'

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

	// @OneToOne(() => Address)
	// address?: Address

	// @OneToMany(() => Ocurrences, (ocurrence) => ocurrence.user)
	// ocurrences?: Ocurrences[]

	constructor() {
		if (!this.id) {
			this.id = randomUUID()
		}
	}
}
