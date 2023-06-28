import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class PassageRegisterDto {
  @IsString()
  readonly email: string;

  readonly user_metadata: object;
}
