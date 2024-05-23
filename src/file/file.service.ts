import { BadRequestException, Injectable } from '@nestjs/common';
import multer from 'multer';
import { FileDto } from './dto/file.dto';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { FileUtil } from 'src/utils/FileUtil';
import { join } from 'path';
const Path = require('path');
const fs = require('fs');

@Injectable()
export class FileService {
  constructor(private configService: ConfigService) {}

  public uploadSingleFile(file: Express.Multer.File): FileDto {
    if (!file) {
      throw new BadRequestException('File is required !');
    }

    return {
      filename: file.originalname,
      filenameUUID: file.filename,
      extension: Path.extname(file.originalname),
      size: file.size,
      url:
        this.configService.get<string>('FILE_IMAGE_BASE_URL') + file.filename,
    } as FileDto;
  }

  public viewImage(filename: string): string {
    if (this.IsImageByNameExist(filename)) {
      return join(
        this.configService.get<string>('FILE_IMAGE_LOCATION'),
        filename,
      );
    }

    throw new BadRequestException(`Image ${filename} it not found.`);
  }

  public IsImageByNameExist = (fileName: string): boolean => {
    const dir = this.configService.get<string>('FILE_IMAGE_LOCATION');

    const files = fs.readdirSync(dir);

    for (const file of files) {
      console.log(file);
      if (file === fileName) {
        return true;
      }
    }
    return false;
  };
}
