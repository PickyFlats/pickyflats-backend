import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Profile } from './schemas/profile.schema';
import { ProfilesService } from './profiles.service';
import { UsersService } from '../users/users.service';

@Controller('profiles')
export class ProfilesController {
  constructor(
    private readonly usersService: UsersService,
    private readonly profileService: ProfilesService,
  ) {}
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

  @Get(['/:id'])
  @UseGuards(AuthGuard)
  async getUserProfileById(@Param('id') userId, @Res() response) {
    const user = await this.usersService.getUserById(userId);
    // get user profile
    const profile = await this.profileService.getProfileByUserId(userId);
    return response.json({ ...user, ...profile });
  }
}
