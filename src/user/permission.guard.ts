import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(UserService)
  private userService: UserService;

  @Inject(Reflector)
  private reflector: Reflector;

  @Inject(RedisService)
  private redisService: RedisService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const user = request.session.user;
    if (!user) {
      throw new UnauthorizedException('用户未登录');
    }
    //查询redis中的用户权限
    let permissions = await this.redisService.listGet(
      `user_${user.username}_permissions`,
    );
    //如果没查到就查数据库，然后保存到redis
    if (permissions.length == 0) {
      const foundUser = await this.userService.findByUsername(user.username);
      permissions = foundUser.permissions.map((item) => item.name);

      this.redisService.listSet(
        `user_${user.username}_permissions`,
        permissions,
        60 * 30,
      ); //30分钟缓存时间
      console.log(foundUser);
    }

    const permission = this.reflector.get('permission', context.getHandler()); //用reflector读取metadata元数据
    if (permissions.some((item) => item === permission)) {
      //some只要有一项符合就返回true
      return true;
    } else {
      throw new UnauthorizedException('暂无权限访问该接口');
    }
  }
}
