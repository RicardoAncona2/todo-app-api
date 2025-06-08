import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskInput, UpdateTaskInput } from './dto/';
import { User } from '@users/entities/user.entity';
export declare class TasksResolver {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    findAll(user: User): Promise<Task[]>;
    createTask(input: CreateTaskInput, user: User): Promise<Task>;
    updateTask(id: string, input: UpdateTaskInput, user: User): Promise<Task>;
    deleteTask(id: string, user: User): Promise<boolean>;
}
