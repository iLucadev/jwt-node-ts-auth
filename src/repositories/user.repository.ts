// user.repository.ts

import { Repository } from "typeorm";
import { injectable } from "inversify";
import { User } from "../domain/entities/user.entity";
import { CreateUserDto } from "../domain/dtos/createUser.dto";
import { IUserRepository, IUserRepositorySymbol } from "./abstract/iuser.repository";
import { UserCreationFailedException, UserNotFoundException } from "../exceptions/user.exceptions";

@injectable()
export class UserRepository extends Repository<User> implements IUserRepository {
  async findUserById(userId: string): Promise<User | undefined> {
    const user = await this.findOne({ where: { id: userId } });
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    const user = await this.findOne({ where: { email: email } });
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.create(createUserDto);
      return this.save(user);
    } catch (error) {
      throw new UserCreationFailedException();
    }
  }
}

// other methods

// return user ?? undefined vs check if(!user)
/* 
  return user ?? undefined:
  1. It more closely matches the repository method signature which returns Promise<User | undefined>. Returning just User would be inconsistent.
  2. Throwing an error is more appropriate in the service layer if you want to handle "User not found" explicitly. The repository should just return what was found.
  3. Returning undefined allows the caller to differentiate between no user found vs the repository throwing an unexpected error.
  4. It avoids unnecessary try/catch blocks in repository code just to handle "User not found" case.
*/

// Implementaciones que van a pasar al servicio de gestion de perfiles y configuraciones de usuario

/* 
  public async save(entity: User): Promise<User> {
    return this.repository.save(entity);
}
 */
/* 
  public async findAll(): Promise<User[]> {
    return this.repository.findAll();
  } */

/*   
  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  } */

/*   @injectable()
export class UserRepository implements IUserRepository {
  private userRepository: IUserRepository;

  constructor(private repository: IUserRepository) {
    this.userRepository = repository;
  }

  public async findOne(options?: FindOneOptions<Partial<User>>): Promise<User | undefined> {
    const result = await this.repository.findOneBy(options ?? {});
    return result ?? undefined;
  }

  public async findByEmail(email: string): Promise<User | undefined> {}

  async findById(id: string): Promise<User | undefined> {}
  public async create(createUserDto: CreateUserDto): Promise<User> {}
} */
