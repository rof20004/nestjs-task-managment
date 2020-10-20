import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/signin-dto';
import { JwtPayload } from './jwt.interface';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async signUp (createUserDto: CreateUserDto): Promise<void> {
        await this.usersService.createUser(createUserDto);
    }

    async signIn (signInDto: SignInDto): Promise<{ accessToken: string }> {
        await this.usersService.validateUserPassword(signInDto);

        const payload: JwtPayload = { username: signInDto.username };
        const accessToken = this.jwtService.sign(payload);

        return { accessToken };
    }

}
