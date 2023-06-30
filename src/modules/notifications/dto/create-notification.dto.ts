import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  readonly type: string;

  @IsString()
  readonly listingId: string;

  @IsString()
  readonly userID: string;

  @IsString()
  readonly commentId: string;

  @IsString()
  readonly likedUserID: string;
}
