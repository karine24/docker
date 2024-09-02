import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";

@Controller("user")
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Post()
  async create(@Body() user: User): Promise<User> {
    return this.usersService.create(user);
  }

  @Put(":id")
  async update(@Param("id") id: number, @Body() user: User): Promise<any> {
    return this.usersService.update(id, user);
  }

  @Delete(":id")
  async delete(@Param("id") id: number): Promise<void> {
    await this.usersService.delete(id);
  }

  @Post("/populate/:numberOfUsersToBeCreated")
  async populateUsers(
    @Param("numberOfUsersToBeCreated") numberOfUsersToBeCreated: number
  ): Promise<void> {
    await this.usersService.populateUsers(numberOfUsersToBeCreated);
  }
}
