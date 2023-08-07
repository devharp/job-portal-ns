import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserRegistrationService } from './user-registration.service';
import { User } from 'src/schema/users/user.schema';
import { globalValidationPipe } from 'src/pipes/global-validation.pipe';
import { UserDTO } from 'src/constants/dto/user.dto.class';
import { resetPasswordDto } from 'src/constants/dto/mail.dto.class';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('user-registration')
export class UserRegistrationController {
  constructor(
    private readonly userRegistrationService: UserRegistrationService,
  ) {}

  @Post()
  create(@Body(globalValidationPipe) user: UserDTO): any {
    return this.userRegistrationService.create(user);
  }

  @Post('request-reset')
  async requestReset(@Body(globalValidationPipe) payload: resetPasswordDto) {
    return await this.userRegistrationService.resetPassword(payload.email);
  }

  @Post('/update-password/:token')
  async updatePasswordField(
    @Body('password') newPassword: string,
    @Param('token') token: string,
  ) {
    return await this.userRegistrationService.newPasswordUsingToken(
      newPassword,
      token,
    );
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userRegistrationService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<User> {
    return this.userRegistrationService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() user: User): Promise<User> {
    return this.userRegistrationService.update(id, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<User> {
    return this.userRegistrationService.delete(id);
  }

  @Post('/update')
  @UseInterceptors(FileInterceptor('avatar')) // 'avatar' should match the field name in the HTML form
  async createUser(@UploadedFile() avatar: Express.Multer.File) {
    console.log('user controller---------->', avatar);
    const timestamp = new Date().toISOString().replace(/:/g, '-'); // Generate timestamp for filename
    const uploadedFileName = `${timestamp}-${avatar.originalname}`; // New filename
    const publicFilePath = path.join(
      __dirname,
      '..',
      './../../public',
      uploadedFileName,
    );
    console.log('user controller---------->', publicFilePath);
    // Write the file to the public folder
    fs.writeFileSync(publicFilePath, avatar.buffer);

    return { message: 'File uploaded successfully' };
  }
}
