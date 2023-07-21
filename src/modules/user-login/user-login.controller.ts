import {
  Controller,
  Request,
  Post,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { Request as Req } from 'express';

@Controller('user-login')
export class UserLoginController {
  /**
   * DO NOT REMOVE THE FOLLOWING COMMENTED CODE
   *
   * TODO: Not to be removed
   */
  // @Post()
  // async login(@Body() loginPayload: LoginDto) {
  //   return (await this.userLoginService.login(loginPayload))
  //     ? { message: 'Login Successful' }
  //     : new HttpException('Login Unsuccessful', HttpStatus.UNAUTHORIZED);
  // }

  @UseGuards(LocalAuthGuard)
  @Post('')
  async login(@Request() req: Pick<Req, keyof Req> & { user: string }) {
    return req?.user
      ? { access_token: req.user }
      : new HttpException('Login Unsuccessful', HttpStatus.UNAUTHORIZED);
  }
}
