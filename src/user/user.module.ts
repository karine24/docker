import { Module } from "@nestjs/common";
import { UserService } from "./services/user.service";
import { UsersController } from "./controllers/user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { CacheEnvironmentVariableService } from "./services/cache-environment-variables.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UserService, CacheEnvironmentVariableService],
})
export class UserModule {}
