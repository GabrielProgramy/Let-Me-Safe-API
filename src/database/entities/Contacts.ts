import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { randomUUID } from "node:crypto";
import { Users } from "./User";

@Entity("contacts")
export default class Contacts {
  @PrimaryColumn()
  id?: string;

  @Column()
  name: string;

  @Column()
  email?: string;

  @Column()
  phone: string;

  @Column()
  userId: string;

  @ManyToOne(() => Users)
  @JoinColumn()
  user?: Users;

  constructor() {
    if (!this.id) {
      this.id = randomUUID();
    }
  }
}
