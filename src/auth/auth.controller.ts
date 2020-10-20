import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin-dto';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('/signup')
    async signUp (@Body() createUserDto: CreateUserDto): Promise<void> {
        await this.authService.signUp(createUserDto);
    }

    @Post('/signin')
    async signIn (@Body() signInDto: SignInDto): Promise<{ accessToken: string }> {
        return await this.authService.signIn(signInDto);
    }

}
