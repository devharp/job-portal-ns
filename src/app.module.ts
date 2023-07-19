import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRegistrationModule } from './modules/user-registration/user-registration.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/job-portal'),
    UserRegistrationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
