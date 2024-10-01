import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis, RedisKey } from "ioredis";

@Injectable()
export class CacheService {
  private cache: Redis;

  constructor(private readonly configService: ConfigService) {}

  openConnection() {
    this.cache = new Redis({
      maxRetriesPerRequest: 3,
      offlineQueue: false,
      host: this.configService.get<string>("REDIS_HOST"),
      port: this.configService.get<number>("REDIS_PORT"),
    });
    this.cache.on("error", (error: Error) => {
      console.error(error.message, error.stack);
    });
  }

  async closeConnection() {
    if (this.cache) {
      await this.cache.quit();
    }
  }

  async get(key: RedisKey): Promise<string> {
    this.openConnection();
    const cacheReturn = this.cache.get(key);
    await this.closeConnection();
    return cacheReturn;
  }

  async set(
    key: RedisKey,
    value: string,
    ttl?: number
  ): Promise<string | Buffer | number> {
    let cacheReturn: string | Buffer | number;
    this.openConnection();
    if (ttl) {
      cacheReturn = await this.cache.set(key, value, "PX", ttl);
    } else {
      cacheReturn = await this.cache.set(key, value);
    }
    await this.closeConnection();

    return cacheReturn;
  }

  async deleteAll(redisKeys: RedisKey[]): Promise<void> {
    this.openConnection();
    await this.cache.del(redisKeys);
    await this.closeConnection();
  }
}
