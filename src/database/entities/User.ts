import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm'
import { randomUUID } from 'node:crypto'
import Address from './Address'
import Community from './Community'
import { Ocurrences } from './Ocurrences'
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

	@OneToMany(() => Ocurrences, (ocurrence) => ocurrence.user)
	ocurrences?: Ocurrences[]

	@OneToMany(() => Community, community => community.owner)
	communities?: Community[]

	constructor() {
		if (!this.id) {
			this.id = randomUUID()
		}
	}
}
