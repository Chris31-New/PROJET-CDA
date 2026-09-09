import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './createProfileDto';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
