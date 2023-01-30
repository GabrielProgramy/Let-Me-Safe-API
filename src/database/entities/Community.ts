import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm'
import { Users } from './User'
import { randomUUID } from 'node:crypto'

@Entity('community')
export default class Community {
	@PrimaryColumn()
	id?: string

	@Column()
	name: string

	@Column()
	description: string

	@Column({ nullable: true })
	members?: string

	membersArray?: string[]

	@Column()
	privacy: boolean

	@Column()
	owner: string

	@ManyToOne(() => Users, user => user.id)
	@JoinColumn({ name: 'owner' })
	user?: Users

	constructor() {
		if (!this.id) this.id = randomUUID()
		if (this.members) this.membersArray = Array.from(this.members)
	}
}
