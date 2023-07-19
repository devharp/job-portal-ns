import { Module } from '@nestjs/common';
import { UserRegistrationController } from './user-registration.controller';
import { UserRegistrationService } from './user-registration.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/users/user.schema';
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
  ],
  controllers: [UserRegistrationController],
  providers: [UserRegistrationService],
})
export class UserRegistrationModule {}
