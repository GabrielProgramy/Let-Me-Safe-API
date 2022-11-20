import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
import { v4 as uuid } from 'uuid'
import Address from './Address'

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

  constructor() {
    if (!this.id) {
      this.id = uuid()
    }
  }
}
