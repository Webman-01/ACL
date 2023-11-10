import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async listGet(key: string) {
    return this.redisClient.lRange(key, 0, -1);
    //返回列表中所有key的列表值
  }

  async listSet(key: string, list: Array<string>, ttl?: number) {
    for (let i = 0; i < list.length; i++) {
      await this.redisClient.lPush(key, list[i]);
      //将一个或多个值插入到列表头部。 如果 key 不存在，一个空列表会被创建并执行 LPUSH 操作
    }
    if (ttl) {
      await this.redisClient.expire(key, ttl); //为指定键设置过期时间
    }
  }
}
