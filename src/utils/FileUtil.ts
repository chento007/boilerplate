import { ConfigService } from '@nestjs/config';
import { FileDto } from 'src/file/dto/file.dto';
import { v4 as uuid } from 'uuid';
const Path = require('path');

export class FileUtil {
  constructor(private configService: ConfigService) {}

  public static uploadFile(file: Express.Multer.File): FileDto {
    return {
      filename: file.originalname,
      filenameUUID: file.filename,
      extension: Path.extname(file.originalname),
      size: file.size,
      url: 'wait it progressing',
    } as FileDto;
  }
}
