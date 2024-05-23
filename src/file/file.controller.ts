import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileDto } from './dto/file.dto';
import { FileService } from './file.service';
import { FileUtil } from 'src/utils/FileUtil';
import { ConfigService } from '@nestjs/config';
import { LocalFilesInterceptor } from 'src/common/config/fileConfig';
import { error } from 'console';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('api/v1/files')
export class FileController {
  constructor(
    private fileService: FileService,
    private readonly configService: ConfigService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'file',
    }),
  )
  public uploadSingleFile(@UploadedFile() file: Express.Multer.File): FileDto {
    return this.fileService.uploadSingleFile(file);
  }

  @Get('/:filename')
  public viewImage(@Param('filename') filename: string, @Res() res): any {
    return res.sendFile(this.fileService.viewImage(filename));
  }
}
