import { TaskDto } from "src/tasks/dto/task.dto";
import { UserBuilder } from "../user.builder";
import { Users } from "../users.entity";

export class UserDto {

    id: number;
    username: string;
    tasks: TaskDto[];

    toEntity (): Users {
        return new UserBuilder()
            .withId(this.id)
            .withUsername(this.username)
            .build();
    }

}