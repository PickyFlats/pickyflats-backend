import { Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { PassageRegisterDto } from './dto/register-user.dto';
import Passage from '@passageidentity/passage-node';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PassageService {
  private passage: Passage;
  constructor(private configService: ConfigService) {
    // Passage requires an App ID and, optionally, an API Key
    const passageConfig = {
      appID: configService.get('PASSAGE_APP_ID'),
      apiKey: configService.get('PASSAGE_API_KEY'),
    };
    this.passage = new Passage(passageConfig);
  }

  async registerUserForPassage(registerDto: PassageRegisterDto) {
    // const passage = new Passage(passageConfig);
    const { email, user_metadata } = registerDto;
    // Authenticate request using Passage
    await this.passage.user.create({
      email,
      user_metadata: { ...user_metadata },
    });
  }

  async login(@Request() req) {
    const userID = await this.passage.authenticateRequestWithHeader(req);
    // const userID = await this.passage.authenticateRequest(req);
    if (userID) {
      // user is authenticated
      // !phone not used
      const { email } = await this.passage.user.get(userID);
      return email;
    } else {
      throw new UnauthorizedException('Invalid auth request');
    }
  }
}
