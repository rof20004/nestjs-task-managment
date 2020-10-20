import { Task } from "../tasks/task.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserDtoBuilder } from "./dto/user-dto.builder";
import { UserDto } from "./dto/user.dto";

@Entity()
@Unique(['username'])
export class Users extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @OneToMany(type => Task, task => task.user, { eager: true })
    tasks: Task[];

    toDto (): UserDto {
        return new UserDtoBuilder()
            .withId(this.id)
            .withUsername(this.username)
            .build();
    }

}