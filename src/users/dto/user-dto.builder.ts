import { TaskDto } from "src/tasks/dto/task.dto";
import { UserDto } from "./user.dto";

export class UserDtoBuilder {

    private readonly _user: UserDto;

    constructor() {
        this._user = new UserDto();
    }

    withId (id: number): UserDtoBuilder {
        this._user.id = id;
        return this;
    }

    withUsername (username: string): UserDtoBuilder {
        this._user.username = username;
        return this;
    }

    withTasks (tasks: TaskDto[]): UserDtoBuilder {
        this._user.tasks = tasks;
        return this;
    }

    build (): UserDto {
        return this._user;
    }

}