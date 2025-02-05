import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LOCAL_NAME_SERVICE } from './utils/constantsStategies';

@Injectable()
export class LocalAuthGuard extends AuthGuard(LOCAL_NAME_SERVICE) {}
