import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CacheModule } from "./cache/cache.module";
import { dataSourceOptions } from "./db/data-source";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    CacheModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
