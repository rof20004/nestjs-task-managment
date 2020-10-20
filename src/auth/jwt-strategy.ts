import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserDto } from "src/users/dto/user.dto";
import { UsersService } from "src/users/users.service";
import { JwtPayload } from "./jwt.interface";
import * as config from 'config';

const jwtConfig = config.get('jwt');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        private readonly usersService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || jwtConfig.secret
        });
    }

    async validate (payload: JwtPayload): Promise<UserDto> {
        try {
            const userDto = await this.usersService.findByUsername(payload.username);
            return userDto;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new UnauthorizedException();
            }

            throw error;
        }
    }

}