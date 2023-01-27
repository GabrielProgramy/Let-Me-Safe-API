import { Column, Entity, PrimaryColumn } from 'typeorm'
import { v4 as uuid } from 'uuid'
// import { Users } from './User'

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
  user_id?: string

  @Column('jsonb', { nullable: true })
  location?: string

  // @ManyToOne(() => Users)
  // user?: Users

  constructor() {
    if (!this.id) {
      this.id = uuid()
    }
    if (!this.date) {
      this.date = new Date()
    }
  }
}
