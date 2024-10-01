import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
  @ApiProperty({
    example: 2,
    description: `User id`,
  })
  id: number;

  @ApiProperty({
    example: "Paulo",
    description: `User name`,
  })
  name: string;

  @ApiProperty({
    example: "paulo@gmai.com",
    description: `User email`,
  })
  email: string;
}
