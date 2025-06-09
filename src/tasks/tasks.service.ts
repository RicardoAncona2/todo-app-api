import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
    ) { }

    async findTasksByUser(userId: string): Promise<Task[]> {
        return this.taskRepository.find({ where: { user: { id: userId } } });
    }

    async create(input: CreateTaskInput, userId: string): Promise<Task> {
        const task = this.taskRepository.create({
            ...input,
            user: { id: userId }, // assumes Task has a relation to User
        });
        return this.taskRepository.save(task);
    }

    async update(id: string, input: UpdateTaskInput, userId: string): Promise<Task> {
        const task = await this.taskRepository.findOne({
            where: { id, user: { id: userId } },
            relations: ['user'],
        });
        if (!task) {
            throw new NotFoundException('Task not found or you do not have permission to update it');
        }
        Object.assign(task, input);
        const updatedTask = await this.taskRepository.save(task);
        return updatedTask;
    }

    async delete(id: string, userId: string): Promise<boolean> {
        const task = await this.taskRepository.findOne({
            where: { id },
            relations: ['user'],
        });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        if (task.user.id !== userId) {
            throw new ForbiddenException('You cannot delete this task');
        }

        await this.taskRepository.remove(task);
        return true;
    }
}
