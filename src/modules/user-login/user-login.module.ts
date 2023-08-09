import { Module } from '@nestjs/common';
import { UserLoginController } from './user-login.controller';
import { UserLoginService } from './user-login.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './../../../src/schema/users/user.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  UserSeeker,
  UserSeekerSchema,
} from './../../../src/schema/users/seeker.user.schema';
import {
  UserProvider,
  UserProviderSchema,
} from './../../../src/schema/users/provider.user.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';

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
    JwtModule.registerAsync({
      // secret: 'your_secret_key_here',
      // signOptions: { expiresIn: '1d' }, // Token expiration time (optional)
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_KEY'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRE') + 'd',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserLoginController],
  providers: [UserLoginService],
})
export class UserLoginModule {}
