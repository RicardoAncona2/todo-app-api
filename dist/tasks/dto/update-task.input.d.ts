import { TaskStatus } from '@tasks/entities';
export declare class UpdateTaskInput {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
}
