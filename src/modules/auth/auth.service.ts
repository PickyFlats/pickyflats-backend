import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Roles } from './schemas/roles.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    const payload = { userId: user.id, email: user.email, roles: user.roles };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }

  async register(registerDto: RegisterDto) {
    const { email, firstName, lastName, password } = registerDto;

    // check for account exist or not
    const existUser = await this.userModel.findOne({ email });
    if (existUser) {
      throw new Error('Account already exits with provided email!');
    }

    const newUser = await this.userModel.create({
      firstName,
      lastName,
      email,
      password: bcrypt.hashSync(password, 10),
      roles: [Roles.USER], // by default role will be only `user` on creating new account
    });

    const payload = {
      userId: newUser.id,
      email: newUser.email,
      roles: newUser.roles,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  verifyToken(token: string): JwtPayload {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      // Token verification failed
      return null;
    }
  }
}
