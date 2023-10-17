import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';

@Injectable()
export class TwilioService {
  private twilioClient: twilio.Twilio;

  constructor(private readonly configService: ConfigService) {
    this.twilioClient = twilio(
      this.configService.get('TWILIO_ACCOUNT_SID'),
      this.configService.get('TWILIO_AUTH_TOKEN'),
    );
  }

  async sendSms(to: string, body: string): Promise<void> {
    try {
      await this.twilioClient.messages.create({
        body,
        to,
        from: '(424) 888-7456',
      });
    } catch (error) {
      throw new Error(`Twilio error: ${error.message}`);
    }
  }
}
