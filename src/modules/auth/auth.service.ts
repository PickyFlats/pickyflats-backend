import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { signAuthToken } from 'src/utils/jwt';

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const existUser = await this.userModel.findOne({ email });
    if (!existUser || !bcrypt.compareSync(password, existUser.password)) {
      throw new Error('Invalid credentials!');
    }
    const accessToken = signAuthToken(existUser.toJSON());
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

    const accessToken = signAuthToken(newUser.toJSON());
    return { accessToken };
  }
}
