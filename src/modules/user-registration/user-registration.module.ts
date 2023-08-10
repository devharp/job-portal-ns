import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserRegistrationController } from './user-registration.controller';
import { UserRegistrationService } from './user-registration.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/users/user.schema';

import { MailService } from 'src/utilities/mail.service';
import { EncryptionService } from 'src/utilities/encryption.service';
import { Helper } from 'src/utilities/helper.service';
import {
  UserSeeker,
  UserSeekerSchema,
} from 'src/schema/users/seeker.user.schema';
import {
  UserProvider,
  UserProviderSchema,
} from 'src/schema/users/provider.user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: UserSeeker.name,
        schema: UserSeekerSchema,
      },
      {
        name: UserProvider.name,
        schema: UserProviderSchema,
      },
    ]),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const mailerConfig = {
          transport: {
            host: configService.get<string>('MAIL_HOST'),
            port: configService.get<number>('MAIL_PORT'),
            secure: false,
            auth: {
              user: configService.get<string>('MAIL_USER').replace(/['"]/g, ''),
              pass: configService.get<string>('MAIL_PASS').replace(/['"]/g, ''),
            },
          },
          defaults: {
            from: configService.get<string>('MAIL_USER').replace(/['"]/g, ''),
          },
        };
        return mailerConfig;
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [UserRegistrationController],
  providers: [UserRegistrationService, MailService, EncryptionService, Helper],
  exports: [EncryptionService, MailService, UserRegistrationService, Helper],
})
export class UserRegistrationModule {}
