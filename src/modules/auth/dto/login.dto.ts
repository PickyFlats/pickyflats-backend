import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class LoginDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly password: string;
}
