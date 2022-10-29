import {Request} from "express";
import { User } from '../user/user.entity';
export interface IMyRequestInterface extends Request{
  user?:User
}
