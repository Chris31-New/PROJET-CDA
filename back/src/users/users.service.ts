import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { User } from 'prisma/generated/prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async create(
    body: CreateUserDto,
  ): Promise<Omit<User, 'password' | 'refreshToken'>> {
    const { ...rest } = body;

    return this.prisma.user.create({
      data: {
        ...rest,
        password: await this.authService.hash(body.password),
      },
      omit: { password: true, refreshToken: true },
    });
  }

  async findAll(): Promise<Omit<User, 'password' | 'refreshToken'>[]> {
    return this.prisma.user.findMany({
      omit: {
        password: true,
        refreshToken: true,
      },
    });
  }

  async findAllIndividual(): Promise<
    Omit<User, 'password' | 'refreshToken'>[]
  > {
    return this.prisma.user.findMany({
      where: { role: 'INDIVIDUAL' },
      omit: { password: true, refreshToken: true },
      include: { profile: true },
    });
  }

  async findOne(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
  async countByEmail(email: string): Promise<number | null> {
    return this.prisma.user.count({ where: { email } });
  }

  async findByEmailOrThrow(email: string): Promise<User> {
    return this.prisma.user.findUniqueOrThrow({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { confirmPassword, ...data } = updateUserDto;

    if (data.password) {
      data.password = await this.authService.hash(data.password);
    }

    const userUpdated = await this.prisma.user.update({
      where: { id },
      data,
    });

    return userUpdated;
  }

  async remove(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
