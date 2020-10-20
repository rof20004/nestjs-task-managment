import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUserDto } from 'src/auth/get-user.decorator';
import { UserDto } from 'src/users/dto/user.dto';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {

    private logger = new Logger('TaskController');

    constructor(private readonly tasksService: TasksService) { }

    @Get()
    async getAllTasks (
        @Query() filterDto: GetTasksFilterDto,
        @GetUserDto() userDto: UserDto
    ): Promise<Task[]> {
        this.logger.verbose(`User "${userDto.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`);
        return await this.tasksService.getTasks(filterDto, userDto);
    }

    @Get('/:id')
    async getTaskById (
        @Param('id', ParseIntPipe) id: number,
        @GetUserDto() userDto: UserDto
    ): Promise<Task> {
        return await this.tasksService.getTaskById(id, userDto);
    }

    @Post()
    async createTask (
        @Body() createTaskDto: CreateTaskDto,
        @GetUserDto() userDto: UserDto
    ): Promise<Task> {
        this.logger.verbose(`User "${userDto.username}" creating a new task. Data: ${JSON.stringify(createTaskDto)}`);
        return await this.tasksService.createTask(createTaskDto, userDto);
    }

    @Delete('/:id')
    async deleteTask (
        @Param('id', ParseIntPipe) id: number,
        @GetUserDto() userDto: UserDto
    ): Promise<void> {
        await this.tasksService.deleteTask(id, userDto);
    }

    @Patch('/:id/status')
    async updateTaskStatus (
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUserDto() userDto: UserDto
    ): Promise<Task> {
        return await this.tasksService.updateTaskStatus(id, status, userDto);
    }

}
