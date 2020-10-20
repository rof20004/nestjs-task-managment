import { TaskStatus } from "../task-status.enum";

export class TaskDto {

    id: number;
    title: string;
    description: string;
    status: TaskStatus;

}