import { UserDto } from "../dtos/user.dto";

export function parseUser(user: UserDto): UserDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}
