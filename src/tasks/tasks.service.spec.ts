import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockUser = { id: 12, username: 'Test user' };

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn(),
    save: jest.fn()
});

describe('TasksService', () => {
    let tasksService;
    let taskRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRepository }
            ]
        }).compile();

        tasksService = module.get<TasksService>(TasksService);
        taskRepository = module.get<TaskRepository>(TaskRepository);
    });

    describe('getTasks', () => {
        it('get all tasks from the repository', async () => {
            taskRepository.getTasks.mockResolvedValue('Some value');

            expect(taskRepository.getTasks).not.toHaveBeenCalled();
            const filters: GetTasksFilterDto = { status: TaskStatus.IN_PROGRESS, search: 'Some search query' };
            const result = await tasksService.getTasks(filters, mockUser);
            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual('Some value');
        });
    });

    describe('getTaskById', () => {
        it('calls taskRepository.findOne() and succesfully retrieve and return the task', async () => {
            const mockTask = { title: 'Test task', description: 'Test desc' };
            taskRepository.findOne.mockResolvedValue(mockTask);

            const result = await tasksService.getTaskById(1, mockUser);
            expect(result).toEqual(mockTask);

            expect(taskRepository.findOne).toHaveBeenCalledWith({ where: { id: 1, user: { id: mockUser.id } } });
        });

        it('throws an error as task is not found', () => {
            taskRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow();
        });
    });

    describe('createTask', () => {
        it('calls taskRepository.createTask and return the result', async () => {
            expect(taskRepository.createTask).not.toHaveBeenCalled();

            const mockTask = { title: 'Task test', description: 'Task description' };
            taskRepository.createTask.mockResolvedValue(mockTask);

            const result = await tasksService.createTask(mockTask, mockUser);
            expect(taskRepository.createTask).toHaveBeenCalledWith(mockTask, mockUser);
            expect(result).toEqual(mockTask);
        });
    });

    describe('deleteTask', () => {
        it('calls taskRepository.deleteTask() to delete a task', async () => {
            taskRepository.delete.mockResolvedValue({ affected: 1 });
            expect(taskRepository.delete).not.toHaveBeenCalled();

            await tasksService.deleteTask(1, mockUser);
            expect(taskRepository.delete).toHaveBeenCalledWith({ id: 1, user: { id: mockUser.id } });
        });

        it('throws an error as task not found', () => {
            taskRepository.delete.mockResolvedValue({ affected: 0 });
            expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateTaskStatus', () => {
        it('calls taskRepository.save() to update a task status', async () => {
            tasksService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save: taskRepository.save
            });

            expect(tasksService.getTaskById).not.toHaveBeenCalled();
            expect(taskRepository.save).not.toHaveBeenCalled();

            const result = await tasksService.updateTaskStatus(1, TaskStatus.DONE, mockUser);

            expect(tasksService.getTaskById).toHaveBeenCalled();
            expect(taskRepository.save).toHaveBeenCalled();
            expect(result.status).toEqual(TaskStatus.DONE);
        });
    });
});