import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

// 因为默认的 session 里没有 user 的类型，所以需要扩展下(利用同名 interface 会自动合并的特点来扩展 Session)
// 在该声明文件中，通过declare module 'express-session'语句告诉编译器要对express-session模块进行类型声明。然后，在interface Session中，对Session接口进行了扩展，添加了一个名为user的属性，该属性是一个对象，包含了一个username属性，其类型为字符串
declare module 'express-session' {
  interface Session {
    user: {
      username: string;
    };
  }
}
@Injectable()
export class LoginGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //登陆状态检查，给接口添加权限控制
    const request: Request = context.switchToHttp().getRequest();
    if (!request.session?.user) {
      throw new UnauthorizedException('用户未登录');
    }
    return true;
  }
}
