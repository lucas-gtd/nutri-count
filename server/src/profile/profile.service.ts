import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async getProfile(userId: string): Promise<Profile | null> {
    return this.profileRepository.findOne({ where: { user_id: userId } });
  }

  async upsertProfile(userId: string, dto: UpdateProfileDto): Promise<Profile> {
    let profile = await this.profileRepository.findOne({
      where: { user_id: userId },
    });

    if (profile) {
      Object.assign(profile, dto);
    } else {
      profile = this.profileRepository.create({ ...dto, user_id: userId });
    }

    return this.profileRepository.save(profile);
  }
}
