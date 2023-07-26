import {
  BadRequestException,
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { classToPlain, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Model } from 'mongoose';
import {
  UserDTO,
  UserProviderDTO,
  UserSeekerDTO,
} from 'src/constants/dto/user.dto.class';
import { USER_ROLE } from 'src/constants/role.user.enum';
import {
  UserProvider,
  UserProviderSchemaClass,
} from 'src/schema/users/provider.user.schema';
import {
  UserSeeker,
  UserSeekerSchemaClass,
} from 'src/schema/users/seeker.user.schema';
import { User, UserSchemaClass } from 'src/schema/users/user.schema';
import { MailService } from 'src/utilities/mail.service';
import * as bcrypt from 'bcrypt';
import { EncryptionService } from 'src/utilities/encryption.service';

@Injectable()
export class UserRegistrationService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserSeeker.name) private userSeekerModel: Model<UserSeeker>,
    @InjectModel(UserProvider.name)
    private userProviderModel: Model<UserProvider>,
    private mailService: MailService,
    private configService: ConfigService,
    private encryptionService: EncryptionService,
  ) {}

  async create(user: UserDTO): Promise<any> {
    try {
      switch (user.role) {
        case USER_ROLE.SEEKER:
          const userSeeker = plainToClass(UserSeekerDTO, user);
          await this.validateUserDTO(userSeeker, UserSeekerDTO);
          this.addSeeker(userSeeker);
          return { message: 'seeker' };
        case USER_ROLE.PROVIDER:
          const userProvider = plainToClass(UserProviderDTO, user);
          await this.validateUserDTO(userProvider, UserProviderDTO);
          this.addProvider(userProvider);
          return { message: 'provider' };
      }
      return 'ok';
    } catch (error) {
      throw new InternalServerErrorException(
        'An error has occurred while adding a user',
      );
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, user: User): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, user, { new: true }).exec();
  }

  async delete(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  private async addSeeker(seeker: UserSeekerDTO) {
    const userData = await this.userModel.create(
      classToPlain(
        plainToClass(UserSchemaClass, {
          ...seeker,
          password: await bcrypt.hash(seeker.password, 10),
        }),
      ),
    );
    await this.userSeekerModel.create({
      ...classToPlain(plainToClass(UserSeekerSchemaClass, seeker)),
      user: userData._id,
    });
  }

  private async addProvider(provider: UserProviderDTO) {
    try {
      const userData = await this.userModel.create(
        classToPlain(
          plainToClass(UserSchemaClass, {
            ...provider,
            password: await bcrypt.hash(provider.password, 10),
          }),
        ),
      );
      await this.userProviderModel.create({
        ...classToPlain(plainToClass(UserProviderSchemaClass, provider)),
        user: userData._id,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'An error has occurred while adding a user',
      );
    }
  }

  private async validateUserDTO(user: UserDTO, DTOClass: any): Promise<void> {
    const userObject = plainToClass(DTOClass, user);
    const validationErrors = await validate(userObject as object);
    if (validationErrors.length > 0) {
      const errorMessage = validationErrors
        .map((error) => Object.values(error.constraints).join(', '))
        .join(', ');
      throw new BadRequestException(errorMessage);
    }
  }

  public async resetPassword(
    email: string,
  ): Promise<{ success: boolean; message: string }> {
    if (await this.userModel.findOne({ email })) {
      const resetToken: string = this.encryptionService.generateResetToken();
      const expiration = new Date();
      expiration.setMinutes(expiration.getMinutes() + 10);
      await this.userModel.collection.updateOne(
        { email },
        {
          $set: {
            token: {
              cryptoToken: resetToken,
              expiration,
            },
          },
        },
      );
      return await this.mailService.sendEmail(email, resetToken);
    } else {
      throw new HttpException('Unknown Email', HttpStatus.UNAUTHORIZED);
    }
  }

  public async newPasswordUsingToken(
    newPassword: string,
    token: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const updatedUser = await this.userModel.findOneAndUpdate(
        {
          'token.cryptoToken': token,
          'token.expiration': { $gt: new Date() },
        },
        {
          $set: {
            password: await bcrypt.hash(newPassword, 10),
            token: null,
          },
        },
        { new: true },
      );
      if (!updatedUser) {
        return Promise.reject(
          new HttpException('Invalid or expired Link', HttpStatus.UNAUTHORIZED),
        );
      }
      return { success: true, message: 'Password updated successfully.' };
    } catch (error) {
      throw new HttpException(
        'An error occurred while updating password',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
