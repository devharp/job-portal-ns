import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserRegistrationService } from './user-registration.service';
import { User } from 'src/schema/users/user.schema';
import { globalValidationPipe } from 'src/pipes/global-validation.pipe';
import { UserDTO } from 'src/constants/dto/user.dto.class';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { resetPasswordDto } from 'src/constants/dto/mail.dto.class';

@Controller('user-registration')
export class UserRegistrationController {
  constructor(
    private readonly userRegistrationService: UserRegistrationService,
    @InjectModel(User.name) private userModel: Model<User>,
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
}
