import { Column, Entity, PrimaryColumn } from 'typeorm'
import { v4 as uuid } from 'uuid'

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
      this.id = uuid()
    }
  }
}
