import { Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Roles } from './roles.enum';
import { AccountType } from 'src/shared/user/account-type.enum';
import { ProfilesService } from '../profiles/profiles.service';
import { PassageService } from './passage/passage.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private jwtService: JwtService,
    private profileService: ProfilesService,
    private passsageService: PassageService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    const payload = {
      sub: user.id,
      name: user.firstName + user.lastName,
      email: user.email,
      roles: user.roles,
    };
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
      //!FUTURE: registration based on requested account type
      accountType: AccountType.TENANT, // default new user account type
    });

    // create profile after creating new account
    await this.profileService.createProfile(newUser.id);

    // register user for passage.id - so that next time user will able to use passwordless signin feature
    await this.passsageService.registerUserForPassage({
      email,
      user_metadata: {
        name: `${firstName} ${lastName}`,
      },
    });

    const payload = {
      sub: newUser.id,
      name: newUser.firstName + newUser.lastName,
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

  async loginUsingPassageToken(@Request() req) {
    const email = await this.passsageService.login(req);

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid login attempt');
    }

    const payload = {
      sub: user.id,
      name: user.firstName + user.lastName,
      email: user.email,
      roles: user.roles,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
