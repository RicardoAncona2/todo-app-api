import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto';
export declare class TasksService {
    private readonly taskRepository;
    constructor(taskRepository: Repository<Task>);
    findTasksByUser(userId: string): Promise<Task[]>;
    create(input: CreateTaskInput, userId: string): Promise<Task>;
    update(id: string, input: UpdateTaskInput, userId: string): Promise<Task>;
    delete(id: string, userId: string): Promise<boolean>;
}
