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
  ) {}

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

  async update(id: string, userData: any, files: any): Promise<User> {
    if (!this.isValidFile(files)) {
      throw new HttpException('Invalid file.', HttpStatus.BAD_REQUEST);
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '');
    const extension = path.parse(files.avatar[0].originalname).ext;
    const uploadedFileName = `${files.avatar[0].fieldname}_${timestamp}${extension}`;
    const resumeExtension = path.parse(files.resume[0].originalname).ext;
    const resumeFile = `${files.resume[0].fieldname}_${timestamp}${resumeExtension}`;
    const avatarFilePath = path.join(
      __dirname,
      '..',
      './../../public/profiles',
      uploadedFileName,
    );
    const resumeFilePath = path.join(
      __dirname,
      '..',
      './../../public/resumes',
      resumeFile,
    );
    fs.writeFileSync(avatarFilePath, files.avatar[0].buffer);
    userData.avatar = avatarFilePath;
    fs.writeFileSync(resumeFilePath, files.resume[0].buffer);
    userData.resumeUrl = resumeFilePath;
    const { firstName, lastName, email, mobileNo, avatar } = userData;
    const userProfileDetails = { firstName, lastName, email, mobileNo, avatar };
    let userProfile = await this.userModel
      .findByIdAndUpdate(id, userProfileDetails, { new: true })
      .exec();
    const objectId = new mongoose.Types.ObjectId(id);
    return await this.userSeekerModel.findOneAndUpdate(
      { user: objectId },
      userData,
      { new: true },
    );
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
  isValidFile(files: any): boolean {
    if (!files)
      throw new HttpException(
        'file should not be empty',
        HttpStatus.BAD_REQUEST,
      );

    const allowedImageExtensions = ['.jpg', '.jpeg', '.png'];
    const allowedResumeExtensions = ['.pdf'];
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const maxPdfSize = 20 * 1024 * 1024; // 20MB for PDF

    const avatarFile = files.avatar[0];
    const resumeFile = files.resume[0];

    // Validate avatar as an image
    const avatarExtension = avatarFile.originalname
      .toLowerCase()
      .substring(avatarFile.originalname.lastIndexOf('.'));
    const isAvatarImage = allowedImageExtensions.includes(avatarExtension);
    const isAvatarValidSize = avatarFile.size <= maxFileSize;

    // Validate resume as a PDF
    const resumeExtension = resumeFile.originalname
      .toLowerCase()
      .substring(resumeFile.originalname.lastIndexOf('.'));
    const isResumePDF = allowedResumeExtensions.includes(resumeExtension);
    const isResumeValidSize = resumeFile.size <= maxPdfSize;

    return (
      isAvatarImage && isAvatarValidSize && isResumePDF && isResumeValidSize
    );
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
