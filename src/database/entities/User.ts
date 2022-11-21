import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm'
import { v4 as uuid } from 'uuid'
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

  confirmPassword: string

  @Column()
  phone?: string

  @Column({ nullable: true })
  avatar?: string

  @Column({ nullable: true })
  address_id?: string

  @OneToOne(() => Address)
  @JoinColumn()
  address: Address

  @OneToMany(() => Ocurrences, (ocurrence) => ocurrence.user)
  ocurrences: Ocurrences[]

  constructor() {
    if (!this.id) {
      this.id = uuid()
    }
  }
}
