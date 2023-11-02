// createUser.dto.ts

import { RoleEnumType } from "../entities/user.entity";
export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  role?: RoleEnumType.USER;
}
