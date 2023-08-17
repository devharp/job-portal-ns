import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRegistrationModule } from './modules/user-registration/user-registration.module';
import { UserLoginModule } from './modules/user-login/user-login.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import { User, UserSchema } from './schema/users/user.schema';
import * as multer from 'multer';

import {
  UserProvider,
  UserProviderSchema,
} from './schema/users/provider.user.schema';
import {
  UserSeeker,
  UserSeekerSchema,
} from './schema/users/seeker.user.schema';
import { LocalStrategy } from './auth/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { JobPostModule } from './modules/job-post/job-post.module';
import { JobApplicationModule } from './modules/job-application/job-application.module';
import { LocationModule } from './modules/location/location.module';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.local.env' }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
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
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('CON_URI'),
      }),
      inject: [ConfigService],
    }),
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
    MulterModule.register({
      dest: join(__dirname, '..', 'public'),
    }),

    UserRegistrationModule,
    UserLoginModule,
    JobPostModule,
    JobApplicationModule,
    LocationModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, LocalStrategy, JwtStrategy],
})
export class AppModule {}
//   implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(multer().array('files')) // 'files' should match the name attribute of your file input
//       .forRoutes({
//         path: 'user-registration/update-profile/:id',
//         method: RequestMethod.ALL,
//       }); // Adjust the route as needed
//   }
// }
