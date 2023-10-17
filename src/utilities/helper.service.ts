import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class Helper {
  private extension;
  private maxImgSize = 5 * 1024 * 1024;
  private maxPdfSize = 20 * 1024 * 1024;

  public async validateUploadedFile(
    file: any,
    checkFor: string,
  ): Promise<boolean | HttpException> {
    checkFor === 'resume'
      ? (this.extension = 'pdf')
      : (this.extension = ['.jpg', '.jpeg', '.png']);
    if (checkFor === 'avatar') {
      if (
        !this.extension.includes('.' + file.mimetype.split('/')[1]) ||
        file.size > this.maxImgSize
      ) {
        throw new HttpException(
          `Uploaded file must be a '.jpg' or '.jpeg', or '.png' and under 5mb`,
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      if (
        !file.mimetype.includes(this.extension) ||
        file.size > this.maxPdfSize
      ) {
        throw new HttpException(
          `Uploaded file must be a ${this.extension.toUpperCase()} and under 10mb`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return true;
  }

  public async renameUploadedFile(
    file: any,
    relatedTo: string,
  ): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '');
    const thisFile = file.avatar
      ? file.avatar[0].originalname
      : file.resume[0].originalname;
    const extension = path.parse(thisFile).ext;
    return `${relatedTo}_resume_${timestamp}${extension}`;
  }
}
