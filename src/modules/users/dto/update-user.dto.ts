import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class UpdateUserDto {
  readonly firstName: string;
  readonly lastName: string;
  readonly accountType: string;
  readonly lastActivity: Date;
}
