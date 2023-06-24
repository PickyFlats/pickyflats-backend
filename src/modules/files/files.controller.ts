import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseFilePipeBuilder,
  Post,
  Res,
  ServiceUnavailableException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/schemas/roles.schema';
import { Role } from '../auth/decorators/roles.decorator';
import { Response } from 'express';
import { join } from 'path';
import { unlink } from 'fs/promises';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Role(Roles.USER)
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image/*' })
        // .addMaxSizeValidator({
        //   maxSize: 10000, // ~ 10MB
        // })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.filesService.upload(file);
  }

  @Get('/:id')
  async getFileById(@Param('id') fileId: string, @Res() res: Response) {
    try {
      const file = await this.filesService.getFileById(fileId);
      if (!file) {
        throw new NotFoundException('File not found');
      }

      const filePath = join(process.cwd(), file.path);

      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${file.filename}`,
      );

      //!TODO: file based content type
      res.setHeader('Content-Type', 'application/octet-stream');
      res.sendFile(filePath);
    } catch (error) {
      throw new ServiceUnavailableException('Internal server error');
    }
  }

  @Delete('/:id')
  async deleteFileById(@Param('id') fileId: string, @Res() res: Response) {
    try {
      const file = await this.filesService.getFileById(fileId);
      if (!file) {
        throw new NotFoundException('File not found');
      }

      const filePath = join(process.cwd(), file.path);

      // Delete file from storage
      await unlink(filePath);

      //delte from db
      await file.deleteOne();
      res.end();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new ServiceUnavailableException('Internal server error');
      }
    }
  }
}
