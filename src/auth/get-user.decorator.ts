import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserDto } from "src/users/dto/user.dto";

export const GetUserDto = createParamDecorator((data, ctx: ExecutionContext): UserDto => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
});