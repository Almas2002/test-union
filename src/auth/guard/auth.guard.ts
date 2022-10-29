import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import { IMyRequestInterface } from '../../interface/IReqest.interface';


@Injectable()
export class AuthGuard implements CanActivate{
  constructor() {
  }
  canActivate(context: ExecutionContext): boolean | Promise<boolean>{
    try {
      const req = context.switchToHttp().getRequest<IMyRequestInterface>()
      if(!req.user){
        throw new UnauthorizedException("Вы не зарегестрированы")
      }
      return  true
    }catch (e) {
      throw new UnauthorizedException("Вы не зарегестрированы")
    }
  }

}