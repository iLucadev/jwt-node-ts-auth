// user.entity.ts

import { Entity, Column, Index, BeforeInsert } from "typeorm";
import bcrypt from "bcrypt";
import Model from "./model.entity";

export enum RoleEnumType {
  USER = "user",
  ADMIN = "admin",
}

@Entity("users")
export class User extends Model {
  @Column()
  name: string;

  @Index("email_index")
  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    type: "enum",
    enum: RoleEnumType,
    default: RoleEnumType.USER,
  })
  role: RoleEnumType.USER;

  @Column({
    default: "default.png",
  })
  photo: string;

  @Column({
    default: false,
  })
  verified: boolean;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 12);
  }

  static async comparePasswords(candidatePassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  toJSON(): any {
    return { ...this, password: undefined, verified: undefined };
  }
}
