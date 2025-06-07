import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskInput,UpdateTaskInput } from './dto/';
import { GqlAuthGuard } from '@auth/guards/gql-auth.guard';
import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { User } from '@users/entities/user.entity';

@Resolver(() => Task)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [Task], { name: 'myTasks' })
  async findAll(@CurrentUser() user: User): Promise<Task[]> {
    return this.tasksService.findTasksByUser(user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Task)
  async createTask(
    @Args('input') input: CreateTaskInput,
    @CurrentUser() user: User,
  ): Promise<Task> {
    return this.tasksService.create(input, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Task)
  async updateTask(
    @Args('id') id: string,
    @Args('input') input: UpdateTaskInput,
    @CurrentUser() user: User,
  ): Promise<Task> {
    return this.tasksService.update(id, input, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteTask(
    @Args('id') id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.tasksService.delete(id, user.id);
  }
}
