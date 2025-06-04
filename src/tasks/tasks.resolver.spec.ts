import { Test, TestingModule } from '@nestjs/testing';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskInput, UpdateTaskInput } from './dto';

describe('TasksResolver', () => {
  let resolver: TasksResolver;
  let tasksService: TasksService;

  const mockUser = {
    id: 'user-1',
    email: 'user@test.com',
    name: 'User',
    password: 'hashed',
    tasks: [],
  };

  const now = new Date();

  const mockTasks: Task[] = [
    {
      id: 'task-1',
      title: 'Task 1',
      description: 'Desc 1',
      status: TaskStatus.PENDING,
      createdAt: now,
      updatedAt: now,
      user: mockUser,
    },
    {
      id: 'task-2',
      title: 'Task 2',
      description: 'Desc 2',
      status: TaskStatus.PENDING,
      createdAt: now,
      updatedAt: now,
      user: mockUser,
    },
  ];

  const mockTask: Task = {
    id: 'task-3',
    title: 'Task 3',
    description: 'Desc 3',
    status: TaskStatus.PENDING,
    createdAt: now,
    updatedAt: now,
    user: mockUser,
  };

  const mockTasksService = {
    findTasksByUser: jest.fn().mockResolvedValue(mockTasks),
    create: jest.fn().mockResolvedValue(mockTask),
    update: jest.fn().mockResolvedValue(mockTask),
    delete: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksResolver,
        { provide: TasksService, useValue: mockTasksService },
      ],
    }).compile();

    resolver = module.get<TasksResolver>(TasksResolver);
    tasksService = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll (myTasks)', () => {
    it('should return tasks for the user', async () => {
      const result = await resolver.findAll(mockUser as any);
      expect(tasksService.findTasksByUser).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockTasks);
    });
  });

  describe('createTask', () => {
    it('should create a task with user id', async () => {
      const input: CreateTaskInput = {
        title: 'Task 3', description: 'Desc 3',
        status: TaskStatus.PENDING
      };
      const result = await resolver.createTask(input, mockUser as any);
      expect(tasksService.create).toHaveBeenCalledWith(input, mockUser.id);
      expect(result).toEqual(mockTask);
    });
  });

  describe('updateTask', () => {
    it('should update a task by id and user', async () => {
      const input: UpdateTaskInput = { title: 'Updated Task', description: 'Updated Desc' };
      const taskId = 'task-3';

      const result = await resolver.updateTask(taskId, input, mockUser as any);
      expect(tasksService.update).toHaveBeenCalledWith(taskId, input, mockUser.id);
      expect(result).toEqual(mockTask);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task by id and user', async () => {
      const taskId = 'task-3';

      const result = await resolver.deleteTask(taskId, mockUser as any);
      expect(tasksService.delete).toHaveBeenCalledWith(taskId, mockUser.id);
      expect(result).toBe(true);
    });
  });
});
