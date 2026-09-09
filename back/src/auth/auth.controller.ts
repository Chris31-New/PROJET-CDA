import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'prisma/generated/prisma/client';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/create-auth.dto';
import type { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthCookies {
  refreshToken?: string;
}
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() body: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string; user: JwtPayload }> {
    try {
      const user: User = await this.usersService.findByEmailOrThrow(body.email);
      const payload: JwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      if (!(await this.authService.compare(user.password, body.password))) {
        throw new Error();
      }

      const { accessToken, refreshToken } =
        await this._createUserTokens(payload);

      this.authService.insertCookie('refreshToken', refreshToken, response);

      return { accessToken, user: payload };
    } catch {
      throw new BadRequestException('Bad Credentials');
    }
  }

  @Post('signup')
  async signUp(
    @Body() body: CreateUserDto,
  ): Promise<Omit<User, 'password' | 'refreshToken'> | undefined> {
    const countExistingUser = await this.usersService.countByEmail(body.email);
    if (countExistingUser) {
      throw new ConflictException('Email is already used');
    }
    return this.usersService.create(body);
  }

  @Get('refresh-token')
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string; user: JwtPayload }> {
    try {
      const refreshTokenCookie = (request.cookies as AuthCookies).refreshToken;

      if (!refreshTokenCookie)
        throw new Error('No refreshToken in headers or no cookie');

      const payloadRefresh: JwtPayload = await this.jwtService.verifyAsync(
        refreshTokenCookie,
        { algorithms: ['HS256'], secret: process.env.REFRESH_SECRET_KEY },
      );

      const user = await this.usersService.findOne(Number(payloadRefresh.id));
      if (!user || !user.refreshToken) throw new Error('no token in DB');
      if (
        !(await this.authService.compare(user.refreshToken, refreshTokenCookie))
      )
        throw new Error('Token does not match hashed token');
      //fonction async createTokens()
      const payload: JwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      const { accessToken, refreshToken } =
        await this._createUserTokens(payload);
      this.authService.insertCookie('refreshToken', refreshToken, response);
      return { accessToken, user: payload };
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.log('ERREUR');
        throw new UnauthorizedException(e.message);
      }

      throw new UnauthorizedException('Unknown error');
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    try {
      const refreshToken = (request.cookies as AuthCookies).refreshToken;

      if (!refreshToken) throw new Error('No refresh token');

      const payload: JwtPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          algorithms: ['HS256'],
          secret: process.env.REFRESH_SECRET_KEY,
        },
      );

      await this.usersService.update(Number(payload.id), {
        refreshToken: null,
      });

      response.clearCookie('refreshToken');
      return { message: 'Logged Out successfully' };
    } catch {
      throw new UnauthorizedException('Logout Failed');
    }
  }

  private async _createUserTokens(payload: JwtPayload) {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '5m',
      algorithm: 'HS256',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1w',
      algorithm: 'HS256',
      secret: process.env.REFRESH_SECRET_KEY,
    });
    const hashedToken = await this.authService.hash(refreshToken);

    await this.usersService.update(payload.id, { refreshToken: hashedToken });

    return { accessToken, refreshToken };
  }
}
