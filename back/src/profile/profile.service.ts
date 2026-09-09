import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProfileDto } from './dto/createProfileDto';
import { UpdateProfileDto } from './dto/updateProfileDto';
import { Profile } from 'prisma/generated/prisma/client';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async createProfile(
    userId: number,
    profileData: CreateProfileDto,
  ): Promise<Profile> {
    return this.prisma.profile.create({
      data: {
        ...profileData,
        userId,
      },
    });
  }

  async updateProfile(
    userId: number,
    profileData: UpdateProfileDto,
  ): Promise<Profile> {
    return this.prisma.profile.update({
      where: { userId },
      data: profileData,
    });
  }

  async getProfile(userId: number): Promise<Profile | null> {
    return this.prisma.profile.findUnique({
      where: { userId },
    });
  }

  async findIfExists(userId: number): Promise<boolean> {
    const profileUserExists = await this.prisma.profile.count({
      where: { userId: userId },
    });
    return profileUserExists >= 0;
  }
}
