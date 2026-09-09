import { Request } from 'express';
import { JwtPayload } from './roles.guard';

export interface AuthRequest extends Request {
  user: JwtPayload;
}
