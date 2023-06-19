import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

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

    const payload = { sub: user.id, name: user.name, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }

  async register(registerDto: RegisterDto) {
    const { email, name, password } = registerDto;

    // check for account exist or not
    const existUser = await this.userModel.findOne({ email });
    if (existUser) {
      throw new Error('Account already exits with provided email!');
    }

    const newUser = await this.userModel.create({
      name,
      email,
      password: bcrypt.hashSync(password, 10),
    });

    const payload = {
      sub: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}
