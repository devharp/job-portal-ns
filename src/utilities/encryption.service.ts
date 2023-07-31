import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  public generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  public regexAppplication(of: string) {
    const regexQuery = new RegExp(of, 'i');
    return regexQuery;
  }
}
