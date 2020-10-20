import { UserDto } from "src/users/dto/user.dto";
import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    async getTasks (filterDto: GetTasksFilterDto, userDto: UserDto): Promise<Task[]> {
        const { status, search } = filterDto;

        const query = this.createQueryBuilder('task');

        query.where('task.user.id = :userId', { userId: userDto.id });

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere('task.title ILIKE :search OR task.description ILIKE :search', { search: `%${search}%` });
        }

        const tasks = query.getMany();
        return tasks;
    }

    async createTask (createTaskDto: CreateTaskDto, userDto: UserDto): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = userDto.toEntity();

        await this.save(task);

        return task;
    }

}