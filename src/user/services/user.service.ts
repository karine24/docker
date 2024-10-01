import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { CacheService } from "src/cache/cache.service";
import { secondsToMilliseconds } from "date-fns";
import { faker } from "@faker-js/faker";
import { ExceptionCodesEnum } from "src/exception/codes.enum";
import { CacheEnvironmentVariableService } from "./cache-environment-variables.service";
import { UserDto } from "../dtos/user.dto";
import { parseUser } from "../helpers/user-parser.helper";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cacheService: CacheService,
    private readonly cacheEnvironmentVariableService: CacheEnvironmentVariableService
  ) {}

  async findAll(): Promise<UserDto[]> {
    return (await this.userRepository.find()).map((user) => parseUser(user));
  }

  // async findOne(id: number): Promise<User> {
  //   const userFoundAtCache = await this.cacheService.get(`user:${id}`);

  //   if (userFoundAtCache) {
  //     return JSON.parse(userFoundAtCache);
  //   }

  //   const user = await this.userRepository.findOne({ where: { id } });

  //   if (!user) {
  //     throw new NotFoundException(ExceptionCodesEnum.E_USER_NOT_REGISTED);
  //   } else {
  //     await this.cacheService.set(
  //       `user:${id}`,
  //       JSON.stringify(user),
  //       secondsToMilliseconds(30)
  //     );
  //     return user;
  //   }
  // }

  async findOne(id: number): Promise<UserDto> {
    const userFoundAtCache = await this.cacheService.get(
      this.cacheEnvironmentVariableService.getUserKey(id)
    );
    let userFound: UserDto;

    if (userFoundAtCache) {
      userFound = JSON.parse(userFoundAtCache);
    } else {
      userFound = await this.findUserAtDatabaseAndSetCache(id);
    }

    return userFound;
  }

  async create(user: Partial<User>): Promise<UserDto> {
    const newUser = this.userRepository.create(user);
    return parseUser(await this.userRepository.save(newUser));
  }

  async populateUsers(numberOfUsersToBeCreated: number): Promise<void> {
    for (
      let userCreated = 0;
      userCreated < numberOfUsersToBeCreated;
      userCreated++
    ) {
      const name = faker.internet.displayName();
      await this.create({
        name,
        email: faker.internet.email({ firstName: name }),
      });
    }
  }

  async update(id: number, user: Partial<User>): Promise<void> {
    await this.findOne(id);
    await this.userRepository.update(id, user);
  }

  async delete(id: number): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(ExceptionCodesEnum.E_USER_NOT_REGISTED);
    }
    await this.userRepository.delete(id);
  }

  private async findUserAtDatabaseAndSetCache(id: number): Promise<UserDto> {
    const userEntity = await this.userRepository.findOne({ where: { id } });

    if (!userEntity) {
      throw new NotFoundException(ExceptionCodesEnum.E_USER_NOT_REGISTED);
    }

    const user = parseUser(userEntity);
    await this.cacheService.set(
      this.cacheEnvironmentVariableService.getUserKey(id),
      JSON.stringify(user),
      secondsToMilliseconds(30)
    );

    return user;
  }
}
