import {
  Body,
  Controller,
  Delete,
  Req,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UserRegistrationService } from './user-registration.service';
import { User } from './../../../src/schema/users/user.schema';
import { globalValidationPipe } from './../../../src/pipes/global-validation.pipe';
import { UserDTO } from './../../../src/constants/dto/user.dto.class';
import { resetPasswordDto } from './../../../src/constants/dto/mail.dto.class';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserUpdateDto } from './../../../src/constants/dto/user.update.dto';
import { JwtAuthGuard } from './../../../src/auth/jwt-auth.guard';

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

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<User> {
    return this.userRegistrationService.delete(id);
  }
  // update user profile details
  @UseGuards(JwtAuthGuard)
  @Put('/update-profile/:id')
  @UseInterceptors(FileInterceptor('avatar'))
  async createUser(
    @Param('id') id: string,
    @Body(globalValidationPipe) body: UserUpdateDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    const user = await this.userRegistrationService.update(id, body, avatar);
    if (!user) throw new HttpException('id not found', HttpStatus.BAD_REQUEST);
    return { message: ' user profile updated successfully', user: user };
  }
}
