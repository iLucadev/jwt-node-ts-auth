// iuser.repository.ts

import { DeepPartial, FindOneOptions } from "typeorm";
import { User } from "../../domain/entities/user.entity";

export const IUserRepositorySymbol = Symbol("IUserRepository");

export interface IUserRepository {
  findUserById(id: string): Promise<User | undefined>;
  findUserByEmail(email: string): Promise<User | undefined>;
  createUser(entity: DeepPartial<User>): Promise<User>;
}

/*   
  findAll(): Promise<User[]>; 
  save(entity: User): Promise<User>;
  delete(id: string): Promise<void>;
*/
