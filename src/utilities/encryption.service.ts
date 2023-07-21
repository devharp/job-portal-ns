import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  async generateResetToken() {
    const token = crypto.randomBytes(32).toString('hex');
    return token;
  }
}
