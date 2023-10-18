import {
  BadRequestException,
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  ConflictException,
  UploadedFile,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { classToPlain, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import mongoose, { Model } from 'mongoose';
import {
  UserDTO,
  UserProviderDTO,
  UserSeekerDTO,
} from './../../constants/dto/user.dto.class';
import { USER_ROLE } from './../../constants/role.user.enum';
import { User, UserSchemaClass } from 'src/schema/users/user.schema';
import { MailService } from 'src/utilities/mail.service';
import * as bcrypt from 'bcrypt';
import { EncryptionService } from 'src/utilities/encryption.service';
import * as fs from 'fs';
import * as path from 'path';
import {
  UserProvider,
  UserProviderSchemaClass,
} from 'src/schema/users/provider.user.schema';
import {
  UserSeeker,
  UserSeekerSchemaClass,
} from 'src/schema/users/seeker.user.schema';
import { HttpService } from '@nestjs/axios';
import { Helper } from 'src/utilities/helper.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UploadProfileFileTypes } from 'src/constants/upload.file.enum';
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
    private readonly httpService: HttpService,
    private helperService: Helper,
    private cloudinaryService: CloudinaryService
  ) { }

  async create(user: UserDTO): Promise<any> {
    try {
      switch (user.role) {
        case USER_ROLE.SEEKER:
          const userSeeker = plainToClass(UserSeekerDTO, user);
          await this.validateUserDTO(userSeeker, UserSeekerDTO);
          await this.addSeeker(userSeeker);
          return { message: 'seeker' };

        case USER_ROLE.PROVIDER:
          const userProvider = plainToClass(UserProviderDTO, user);
          await this.validateUserDTO(userProvider, UserProviderDTO);
          await this.addProvider(userProvider);
          return { message: 'provider' };
      }
      return 'ok';
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email or phone number already exists');
      } else {
        throw new InternalServerErrorException(error.response.message);
      }
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    const result = await this.userModel.findById(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return result;
  }
  /*
    async update0(updateTo: any, userData: any, files?: Express.Multer.File): Promise<User> {
      try {
        if (files && files.avatar !== undefined) {
          await this.helperService.validateUploadedFile(
            files.avatar[0],
            'avatar',
          );
          
          const updatedAvatar = await this.helperService.renameUploadedFile(
            files,
            updateTo.id,
          );
  
          this.cloudinaryService.uploadImage(files.avatar[0])
  
          const avatarFilePath = path.join(
            __dirname,
            '..',
            './../../public/profiles',
            updatedAvatar,
          );
          fs.writeFileSync(avatarFilePath, files.avatar[0].buffer);
          userData.avatar = avatarFilePath;
        }
        if (files && files.resume !== undefined) {
          await this.helperService.validateUploadedFile(
            files.resume[0],
            'resume',
          );
          const updatedResume = await this.helperService.renameUploadedFile(
            files,
            updateTo.id,
          );
          const resumeFilePath = path.join(
            __dirname,
            '..',
            './../../public/resumes',
            updatedResume,
          );
          fs.writeFileSync(resumeFilePath, files.resume[0].buffer);
          userData.resume = resumeFilePath;
        }
        await this.userModel
          .findByIdAndUpdate(updateTo.id, userData, { new: true })
          .exec();
        const objectId = new mongoose.Types.ObjectId(updateTo.id);
        return updateTo.role === 'provider'
          ? await this.userProviderModel.findOneAndUpdate(
              { user: objectId },
              userData,
              { new: true },
            )
          : await this.userSeekerModel.findOneAndUpdate(
              { user: objectId },
              userData,
              { new: true },
            );
      } catch (error) {
        if (error.code === 11000) {
          throw new ConflictException('Email or phone number already exists');
        } else {
          throw new InternalServerErrorException(error.response);
        }
      }
    }
  */
  async update(updateTo: any, userData: any, files?: UploadProfileFileTypes) {
    try {

      if (!files) { return false; }
      Object.keys(files).map(async (fileName: 'avatar' | 'resume') => {
        await this.helperService.validateUploadedFile(files[fileName][0], fileName);
        const { ext } = path.parse(files[fileName][0].originalname);

        const file = files[fileName][0] as unknown as File;
        const updatedFilename = await this.helperService.renameUploadedFile(file, updateTo.id, fileName, ext);

        const { secure_url } = await this.cloudinaryService.uploadImage(file, updatedFilename);
        userData[fileName] = secure_url

        switch (fileName) {
          case 'avatar':
            await this.saveAvatar(updateTo.id, userData, secure_url);
            break;
          case 'resume':
            this.saveResume(updateTo.id, userData, secure_url);
            break;
          default:
            break;
        }

      })

    }
    catch (error) {
      return false;
    }
  }
  
  private async saveResume(id: any, userData: any, resumeUrl: string) {
    const user = new mongoose.Types.ObjectId(id);
    await this.userSeekerModel.findOneAndUpdate({ user }, {...userData , resumeUrl })
  }
  
  private async saveAvatar(id: any, userData: any, avatar: string) {
    await this.userModel.findByIdAndUpdate(id, { ...userData, avatar }, { new: true })
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

  async suggest(name?: string): Promise<string[]> {
    try {
      const response = await this.httpService
        .get(
          `${this.configService.get(
            'GOV_PATH',
          )}?api-key=${this.configService.get(
            'GOV_API_KEY',
          )}&format=json&limit=400`,
        )
        .toPromise();
      const partialMatch = await this.encryptionService.regexAppplication(name);
      return await response.data.records
        .filter((record) => partialMatch.test(record.name_of_university))
        .map((record) => record.name_of_university);
    } catch (error) {
      throw new HttpException(
        'Something Went Wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
