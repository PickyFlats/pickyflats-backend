import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(['/login'])
  async userLogin(@Res() response, @Body() loginDto: LoginDto) {
    try {
      const loginRes = await this.authService.login(loginDto);
      return response.json(loginRes);
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 401,
        message: err.message,
        error: 'LOGIN_FAILED',
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
        message: err.message,
        error: 'REGISTER_FAILED',
      });
    }
  }
}
