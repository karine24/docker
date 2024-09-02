import { CacheService } from './cache.service';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';

@Module({})
export class CacheModule {
  static forRoot(options?: ConfigModuleOptions): DynamicModule {
    return {
      global: options.isGlobal,
      module: CacheModule,
      providers: [CacheService],
      exports: [CacheService],
    };
  }
}
