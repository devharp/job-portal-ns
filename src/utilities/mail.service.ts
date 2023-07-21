import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { mailDto } from 'src/constants/dto/mail.dto.class';
@Injectable()
export class MailService {
  private logger = new Logger(MailService.name);
  constructor(private readonly mailerService: MailerService) {}
  async sendEmail(recipient: mailDto) {
    const { email, subject, text } = recipient;
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: subject,
        text: text,
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
