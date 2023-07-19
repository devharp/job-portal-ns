import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  classToPlain,
  plainToClass,
  classToClassFromExist,
} from 'class-transformer';
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

@Injectable()
export class UserRegistrationService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserSeeker.name) private userSeekerModel: Model<UserSeeker>,
    @InjectModel(UserProvider.name)
    private userProviderModel: Model<UserProvider>,
  ) {}

  async create(user: UserDTO): Promise<any> {
    switch (user.role) {
      case USER_ROLE.SEEKER:
        const userSeeker = plainToClass(UserSeekerDTO, user);
        await this.validateUserDTO(userSeeker, UserSeekerDTO);
        this.addSeeker(userSeeker);
        return 'seeker';
      case USER_ROLE.PROVIDER:
        const userProvider = plainToClass(UserProviderDTO, user);
        await this.validateUserDTO(userProvider, UserProviderDTO);
        this.addProvider(userProvider);
        return 'provider';
    }
    return 'ok';
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

  private addSeeker(seeker: UserSeekerDTO) {
    const user = classToPlain(plainToClass(UserSchemaClass, seeker));

    const userSeeker = classToPlain(
      plainToClass(UserSeekerSchemaClass, seeker),
    );
    console.log({ user, userSeeker });
  }

  private async addProvider(provider: UserProviderDTO) {
    const user = classToPlain(plainToClass(UserSchemaClass, provider));

    const userProvider = classToPlain(
      plainToClass(UserProviderSchemaClass, provider),
    );

    const db = new this.userModel(user as User);
    await db.save();
    console.log({ user, userProvider });
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
}
