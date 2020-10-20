import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private readonly taskRepository: TaskRepository
    ) { }

    async getTasks (filterDto: GetTasksFilterDto, userDto: UserDto): Promise<Task[]> {
        return await this.taskRepository.getTasks(filterDto, userDto);
    }

    async getTaskById (id: number, userDto: UserDto): Promise<Task> {
        const found = await this.taskRepository.findOne({ where: { id, user: { id: userDto.id } } });

        if (!found) {
            throw new NotFoundException(`Task with #id ${id} not found!`);
        }

        return found;
    }

    async createTask (createTaskDto: CreateTaskDto, userDto: UserDto): Promise<Task> {
        return await this.taskRepository.createTask(createTaskDto, userDto);
    }

    async deleteTask (id: number, userDto: UserDto): Promise<void> {
        const result = await this.taskRepository.delete({ id, user: { id: userDto.id } });
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }

    async updateTaskStatus (id: number, status: TaskStatus, userDto: UserDto): Promise<Task> {
        const task = await this.getTaskById(id, userDto);
        task.status = status;

        await this.taskRepository.save(task);

        return task;
    }

}
