import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis, RedisKey } from "ioredis";

@Injectable()
export class CacheService {
  private readonly cache: Redis;

  constructor(private readonly configService: ConfigService) {
    this.cache = new Redis({
      maxRetriesPerRequest: 3,
      enableOfflineQueue: false,
      offlineQueue: false,
      host: this.configService.get<string>("REDIS_HOST"),
      port: this.configService.get<number>("REDIS_PORT"),
    });
    this.cache.on("error", (error: Error) => {
      console.error(error.message, error.stack);
    });
  }

  async get(key: RedisKey): Promise<string> {
    return this.cache.get(key);
  }

  async set(
    key: RedisKey,
    value: string,
    ttl?: number
  ): Promise<string | Buffer | number> {
    if (ttl) {
      return this.cache.set(key, value, "PX", ttl);
    } else {
      return this.cache.set(key, value);
    }
  }

  async deleteAll(redisKeys: RedisKey[]): Promise<void> {
    await this.cache.del(redisKeys);
  }
}
