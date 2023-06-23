import {
  Body,
  Controller,
  Patch,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Profile } from './schemas/profile.schema';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profileService: ProfilesService) {}
  @Patch(['/me'])
  @UseGuards(AuthGuard)
  async currentUser(
    @Request() req,
    @Res() response,
    @Body() profileDto: Partial<Profile>,
  ) {
    const userId = req.user?.sub;

    await this.profileService.updateProfileByUserId(userId, profileDto);
    const userProfile = this.profileService.getProfileByUserId(userId);

    return response.json(userProfile);
  }
}
