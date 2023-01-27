import { Column, Entity, PrimaryColumn } from 'typeorm'
import { randomUUID } from 'node:crypto'

@Entity('address')
export default class Address {
	@PrimaryColumn()
	id?: string

	@Column()
	street: string

	@Column()
	complement?: string

	@Column()
	district: string

	@Column()
	cep: string

	@Column()
	city: string

	@Column()
	state: string

	constructor() {
		if (!this.id) {
			this.id = randomUUID()
		}
	}
}
