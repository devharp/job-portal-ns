import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class MailService {
  private logger = new Logger(MailService.name);
  constructor(private readonly mailerService: MailerService) {}
  async sendEmail(email: string, token: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset Your Password',
        text: `Click the following link to reset your password: http://localhost:4200/reset-password?token=${token}`,
      });
      this.logger.log(`Email sent to ${email}`);
      return {
        success: true,
        message: 'Check Your Gmail Account',
      };
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}`, error);
      throw new HttpException(
        'Failed to send email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
