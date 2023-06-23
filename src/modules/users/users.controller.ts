import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProfilesService } from '../profiles/profiles.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly profileService: ProfilesService,
  ) {}

  @Get(['/me'])
  @UseGuards(AuthGuard)
  async currentUser(@Request() req, @Res() response) {
    const userId = req.user?.sub;

    const user = await this.usersService.getUserById(userId);
    // get user profile
    const profile = await this.profileService.getProfileByUserId(userId);

    return response.json({ ...user, ...profile });
  }

  // update current user
  @Patch(['/me'])
  @UseGuards(AuthGuard)
  async updateCurrentUser(
    @Request() req,
    @Res() response,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userId = req.user?.sub;

    const user = await this.usersService.updateUserById(userId, updateUserDto);
    response.send(user);
  }
}
