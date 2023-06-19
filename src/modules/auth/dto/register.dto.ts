import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class RegisterDto {
  @IsString()
  @MaxLength(30)
  readonly firstName: string;

  @IsString()
  @MaxLength(30)
  readonly lastName: string;

  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly password: string;
}
