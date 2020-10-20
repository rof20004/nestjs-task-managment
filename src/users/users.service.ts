import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { SignInDto } from 'src/auth/dto/signin-dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UsersRepository)
        private readonly userRepository: UsersRepository
    ) { }

    async createUser (createUserDto: CreateUserDto): Promise<void> {
        const user = createUserDto.toEntity();

        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, user.salt);

        try {
            await this.userRepository.save(user);
        } catch (error) {
            if (error.code === '23505') { // duplicate username
                throw new ConflictException('Username already exists');
            }

            throw new InternalServerErrorException();
        }
    }

    async getAllUsers (): Promise<UserDto[]> {
        const users = await this.userRepository.find();

        if (users.length === 0) {
            throw new NotFoundException('No users found');
        }

        const usersDto = await Promise.all(users.map(user => user.toDto()));
        return usersDto;
    }

    async validateUserPassword (signInDto: SignInDto) {
        const user = await this.userRepository.findOne({ username: signInDto.username });

        const hash = await bcrypt.hash(signInDto.password, user.salt);

        if (!user || (user.password !== hash)) {
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    async findByUsername (username: string): Promise<UserDto> {
        const user = await this.userRepository.findOne({ username });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const userDto = user.toDto();
        return userDto;
    }

}
