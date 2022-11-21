import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { Users } from './User'

@Entity()
export class Ocurrences {
  @PrimaryColumn()
  id?: string

  @Column()
  type: string

  @Column()
  date: Date

  @Column({ nullable: true })
  status: string

  @Column()
  description: string

  @Column({ nullable: true })
  user_id?: string

  @ManyToOne(() => Users, (user) => user.ocurrences)
  user: Users

  constructor() {
    if (!this.id) {
      this.id = uuid()
    }
  }
}
