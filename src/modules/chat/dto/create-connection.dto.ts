import { IsArray, IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class CreateConnectionDto {
  @IsArray()
  @IsNotEmpty()
  readonly participants: string[];

  @IsNotEmpty()
  readonly chatStarter: string;
}
