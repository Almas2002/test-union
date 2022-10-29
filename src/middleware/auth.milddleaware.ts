import {Injectable, NestMiddleware} from "@nestjs/common";
import {NextFunction, Response} from "express";
import {JwtService} from "@nestjs/jwt";
import { UserService } from '../user/user.service';
import { IMyRequestInterface } from '../interface/IReqest.interface';


@Injectable()
export class AuthMiddleware implements NestMiddleware{
  constructor(private jwtService:JwtService,private userService:UserService) {
  }
  async use(req: IMyRequestInterface, res: Response, next:NextFunction): Promise<any> {
    if(!req.headers.authorization){
      req.user = null;
      next()
      return
    }
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decode = this.jwtService.verify(token)
      req.user = await this.userService.findUserById(Number(decode.id))
      next()
    }catch (e) {
      req.user = null;
      next()
    }
  }
}