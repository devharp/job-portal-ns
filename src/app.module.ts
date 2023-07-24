import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRegistrationModule } from './modules/user-registration/user-registration.module';
import { JobPostModule } from './modules/job-post/job-post.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/job-portal'),
    UserRegistrationModule,
    JobPostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
