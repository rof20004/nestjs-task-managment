import { TaskStatus } from "../task-status.enum";
import { TaskDto } from "./task.dto";

export class TaskDtoBuilder {

    private readonly _task: TaskDto;

    constructor() {
        this._task = new TaskDto();
    }

    withId (id: number): TaskDtoBuilder {
        this._task.id = id;
        return this;
    }

    withTitle (title: string): TaskDtoBuilder {
        this._task.title = title;
        return this;
    }

    withDescription (description: string): TaskDtoBuilder {
        this._task.description = description;
        return this;
    }

    withStatus (status: TaskStatus): TaskDtoBuilder {
        this._task.status = status;
        return this;
    }

    build (): TaskDto {
        return this._task;
    }

}