import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'
import { randomUUID } from 'node:crypto'
import { Users } from './User'
import Address from './Address'

@Entity()
export class Ocurrences {
	@PrimaryColumn()
	id?: string

	@Column()
	type: string

	@Column()
	date?: Date

	@Column({ nullable: true })
	status: string

	@Column()
	description: string

	@Column({ nullable: true })
	userId?: string

	@Column('jsonb', { nullable: true })
	location?: string

	@Column({ nullable: true })
	addressId?: string

	@ManyToOne(() => Address, address => address.ocurrences)
	@JoinColumn({ referencedColumnName: 'id' })
	address?: Address

	@ManyToOne(() => Address, address => address.ocurrences)
	@JoinColumn({ referencedColumnName: 'id' })
	user?: Users



	constructor() {
		if (!this.id) {
			this.id = randomUUID()
		}
		if (!this.date) {
			this.date = new Date()
		}
	}
}
