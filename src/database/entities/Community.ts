import { Column, Entity, PrimaryColumn } from 'typeorm'
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
	members?: Array<string>

	@Column()
	privacy: boolean

	@Column()
	owner: string

	@Column(() => Users)
	user?: Users

	constructor() {
		if (!this.id) this.id = randomUUID()
	}
}
