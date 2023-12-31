import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from './auth.guard';
import { Role } from './decorators/roles.decorator';
import { Roles } from './roles.enum';
import { UsersService } from '../users/users.service';
import { ProfilesService } from '../profiles/profiles.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly profileService: ProfilesService,
  ) {}

  @Post(['/login'])
  async userLogin(@Res() response, @Body() loginDto: LoginDto) {
    try {
      const loginRes = await this.authService.login(loginDto);
      return response.json(loginRes);
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 401,
        message: err.message,
      });
    }
  }

  @Post(['/register'])
  async userRegister(@Res() response, @Body() registerDto: RegisterDto) {
    try {
      const registerRes = await this.authService.register(registerDto);
      return response.json(registerRes);
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 401,
        message: err.message,
      });
    }
  }

  //TEST: only roles with admin can access this controller
  @Get(['/admin'])
  @UseGuards(AuthGuard)
  @Role(Roles.ADMIN)
  async testAdmin(@Res() response) {
    return response.json({
      helo: 'world',
    });
  }

  // login using passage token

  @Post(['/login/passage'])
  async userLoginUsingPassage(@Request() req, @Res() response) {
    try {
      const loginRes = await this.authService.loginUsingPassageToken(req);
      return response.json(loginRes);
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 401,
        message: err.message,
      });
    }
  }
}
