import { Module } from '@nestjs/common';
import { PassageService } from './passage.service';

@Module({
  providers: [PassageService],
  exports: [PassageService],
})
export class PassageModule {}
