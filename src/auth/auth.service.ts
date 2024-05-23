import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserRespooneDto } from './dto/user-respone.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { Hash } from 'src/utils/Hash';
import { ConfigService } from '@nestjs/config';
import { TokenBaseRest } from './dto/token-base-rest.dto';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { LoginDto } from './dto/login-user.dto';
import { SelectQueryBuilder } from 'typeorm';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import RequestWithUser from 'src/common/interface/request-with-user.interface';
import { Role } from '../role/role.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  ) {}

  public async signup(
    registerUserDto: RegisterUserDto,
  ): Promise<TokenBaseRest> {
    let { email, password } = registerUserDto;

    const isFound = await this.userRepository.findOneBy({ email: email });
    if (isFound || isFound !== null) {
      throw new BadRequestException('Email is already exist.');
    }

    password = await Hash.makeHash(password);
    const user = await this.userRepository.save({
      email,
      password,
      roles: [new Role()],
    });

    return this.getTokens(user.id);
  }

  public async login(logindto: LoginDto): Promise<TokenBaseRest> {
    const { email, password } = logindto;

    const user = await this.userRepository.findOneBy({ email: email });
    if (!user) {
      throw new BadRequestException('Email or Password invalid');
    }

    const isMatched: boolean = await Hash.isMatch(password, user.password);
    if (!isMatched) {
      throw new BadRequestException('Email or Password invalid');
    }

    const tokens = await this.getTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  public async refreshToken(
    request: RequestWithUser,
    refreshTokenDto: RefreshTokenDto,
  ): Promise<TokenBaseRest> {
    const { refreshToken } = refreshTokenDto;

    const user = await this.userRepository.findOneBy({ id: request.user.id });
    if (!user) {
      throw new ForbiddenException('Access Denied');
    }

    const isRefreshTokenMatch = await Hash.isMatch(
      refreshToken,
      user.refreshToken,
    );
    if (!isRefreshTokenMatch) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.getTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  public async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await Hash.makeHash(refreshToken);
    await this.userRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  public async getTokens(userId: number) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { id: userId },
        {
          secret: this.configService.get<string>('JWT_SECRET_KEY'),
          expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME'),
        },
      ),
      this.jwtService.signAsync(
        { id: userId },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_REFRESH_EXPIRATION_TIME',
          ),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  public async logout(request: RequestWithUser): Promise<boolean> {
    const isUpdated = await this.userRepository.update(request.user.id, {
      refreshToken: null,
    });
    return isUpdated.affected > 0 ? true : false;
  }
}
