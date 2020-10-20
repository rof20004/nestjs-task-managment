import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './user.repository';
import { UsersService } from './users.service';
import { UserController } from './users.controller';

@Module({
    imports: [TypeOrmModule.forFeature([UsersRepository])],
    exports: [UsersService],
    providers: [UsersService],
    controllers: [UserController]
})
export class UserModule { }
