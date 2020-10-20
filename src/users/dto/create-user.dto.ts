import { IsString, Matches, MaxLength, MinLength } from "class-validator";
import { UserBuilder } from "../user.builder";
import { Users } from "../users.entity";

export class CreateUserDto {

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
    password: string;

    toEntity (): Users {
        return new UserBuilder()
            .withUsername(this.username)
            .withPassword(this.password)
            .build();
    }

}