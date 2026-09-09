import {
  BadGatewayException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProfileDto } from './dto/createProfileDto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/updateProfileDto';
import { Profile } from 'prisma/generated/prisma/client';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profileService: ProfileService,
  ) {}

  @UseGuards(AuthGuard)
  @Post(':id')
  async createProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateProfileDto,
  ): Promise<Profile> {
    const existingProfile = await this.profileService.findIfExists(id);
    if (existingProfile)
      throw new BadGatewayException('Profile already exists for this user.');
    return this.profileService.createProfile(id, body);
  }

  @UseGuards(AuthGuard)
  @Patch('update/:id')
  async updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProfileDto,
  ): Promise<Profile> {
    const existingProfile = await this.profileService.findIfExists(id);
    if (!existingProfile)
      throw new NotFoundException(
        'No profile found for this user. Please create one first.',
      );
    return this.profileService.updateProfile(id, body);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getProfile(@Param('id', ParseIntPipe) id: number): Promise<Profile> {
    const profile = await this.profileService.getProfile(Number(id));

    if (!profile) {
      throw new NotFoundException(`Profile with id ${id} doesn't exists`);
    }

    return profile;
  }
}
