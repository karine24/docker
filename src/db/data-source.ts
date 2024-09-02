import { DataSource, DataSourceOptions } from "typeorm";
import { config } from "dotenv";
import { ConfigService } from "@nestjs/config";

config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: configService.getOrThrow("PG_HOST"),
  port: Number(configService.getOrThrow("PG_PORT")),
  username: configService.getOrThrow("PG_USER"),
  password: configService.getOrThrow("PG_PASSWORD"),
  database: configService.getOrThrow("PG_DB"),
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/../../migrations/*{.ts,.js}"],
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
