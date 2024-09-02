import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { CacheService } from "src/cache/cache.service";
import { secondsToMilliseconds } from "date-fns";
import { faker } from "@faker-js/faker";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly cacheService: CacheService
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const userFoundAtCache = await this.cacheService.get(`user:${id}`);

    if (userFoundAtCache) {
      return JSON.parse(userFoundAtCache);
    }

    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException("User does not exist!");
    } else {
      await this.cacheService.set(
        `user:${id}`,
        JSON.stringify(user),
        secondsToMilliseconds(30)
      );
      return user;
    }
  }

  async create(user: Partial<User>): Promise<User> {
    const newuser = this.userRepository.create(user);
    return this.userRepository.save(newuser);
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

  async update(id: number, user: Partial<User>): Promise<User> {
    await this.userRepository.update(id, user);
    return this.userRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException("User does not exist!");
    }
    await this.userRepository.delete(id);
  }
}
