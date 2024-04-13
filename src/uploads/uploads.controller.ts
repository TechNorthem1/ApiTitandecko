import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('/api/v1/uploads')
export class UploadsController {

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  save_files (@UploadedFile() file:Express.Multer.File) {
    return {
      message: "Archivo subido con exito",
      isUpload: true,
      filename: file.originalname
    }
  }
}



