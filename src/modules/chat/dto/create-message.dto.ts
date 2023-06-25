import { IsArray, IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class CreateMessageDto {
  @IsNotEmpty()
  readonly conversationID: string[];

  @IsNotEmpty()
  @IsString()
  senderID: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  // @ArrayNotEmpty()
  // @ArrayMinSize(0)
  // attachments: any[];
}
