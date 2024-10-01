import { Injectable } from "@nestjs/common";

@Injectable()
export class CacheEnvironmentVariableService {
  getUserKey(id: number): string {
    return `user:${id}`;
  }
}
