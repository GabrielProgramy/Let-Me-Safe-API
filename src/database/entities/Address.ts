import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm'
import { randomUUID } from 'node:crypto'
import { Ocurrences } from './Ocurrences'

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

	@OneToMany(() => Ocurrences, ocurrences => ocurrences.address)
	@JoinColumn({ referencedColumnName: 'address_id' })
	ocurrences?: Ocurrences[]

	constructor() {
		if (!this.id) {
			this.id = randomUUID()
		}
	}
}
