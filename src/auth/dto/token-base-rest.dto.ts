import { IsString } from 'class-validator';

export class TokenBaseRest {
  accessToken: string;
  refreshToken: string;
}
