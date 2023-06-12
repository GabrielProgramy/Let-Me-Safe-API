import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm'
import { randomUUID } from 'node:crypto'
import { Ocurrences } from './Ocurrences'
import Contacts from './Contacts'

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

	@OneToMany(() => Ocurrences, ocurrences => ocurrences.user)
	@JoinColumn({ referencedColumnName: 'userId' })
	ocurrences?: Ocurrences[]

	@OneToMany(() => Contacts, contacts => contacts.user)
	@JoinColumn({ referencedColumnName: 'userId' })
	contacts?: Contacts[]

	constructor() {
		if (!this.id) {
			this.id = randomUUID()
		}
	}
}
