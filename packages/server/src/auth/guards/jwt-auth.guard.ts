import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_NAME_SERVICE } from '../utils/constantsStategies';

@Injectable()
export class JWTAuthGuard extends AuthGuard(JWT_NAME_SERVICE) {}
