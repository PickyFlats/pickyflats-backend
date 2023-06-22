import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { File } from './schemas/file.schema';
import { Model } from 'mongoose';
import * as path from 'path';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name) private readonly filesModel: Model<File>,
  ) {}

  async upload(file: Express.Multer.File) {
    const timestamp = new Date().getTime().toString();
    const filename = `${timestamp}-${file.originalname}`;

    const createdFile = new this.filesModel({
      filename: filename,
      path: file.path,
    });
    await createdFile.save();

    return createdFile;
  }

  getFilePath(filename: string): string {
    return path.join('uploads', filename);
  }
}
