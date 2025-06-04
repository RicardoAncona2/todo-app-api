import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let repo: Repository<Task>;

  const mockUserId = 'user-1';
  const mockUser = {
    id: mockUserId,
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedpassword',
    tasks: [],
  };

  const now = new Date();

  const mockTask: Task = {
    id: 'task-1',
    title: 'Test Task',
    description: 'Task desc',
    status: TaskStatus.PENDING,
    createdAt: now,
    updatedAt: now,
    user: mockUser,
  };

  const mockRepo = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repo = module.get<Repository<Task>>(getRepositoryToken(Task));

    jest.clearAllMocks();
  });

  describe('findTasksByUser', () => {
    it('should return tasks for given user', async () => {
      mockRepo.find.mockResolvedValue([mockTask]);

      const result = await service.findTasksByUser(mockUserId);

      expect(mockRepo.find).toHaveBeenCalledWith({ where: { user: { id: mockUserId } } });
      expect(result).toEqual([mockTask]);
    });
  });

  describe('create', () => {
    it('should create and save a new task', async () => {
      const input: CreateTaskInput = {
        title: 'New Task', description: 'New Desc',
        status: TaskStatus.PENDING
      };
      mockRepo.create.mockReturnValue({ ...input, user: { id: mockUserId } });
      mockRepo.save.mockResolvedValue(mockTask);

      const result = await service.create(input, mockUserId);

      expect(mockRepo.create).toHaveBeenCalledWith({ ...input, user: { id: mockUserId } });
      expect(mockRepo.save).toHaveBeenCalledWith({ ...input, user: { id: mockUserId } });
      expect(result).toEqual(mockTask);
    });
  });

  describe('update', () => {
    it('should update and save task when user owns task', async () => {
      const input: UpdateTaskInput = { title: 'Updated Title' };
      mockRepo.findOne.mockResolvedValue({ ...mockTask });
      mockRepo.save.mockResolvedValue({ ...mockTask, ...input });

      const result = await service.update(mockTask.id, input, mockUserId);

      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { id: mockTask.id },
        relations: ['user'],
      });
      expect(mockRepo.save).toHaveBeenCalled();
      expect(result.title).toBe(input.title);
    });

    it('should throw NotFoundException if task not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.update('nonexistent-id', {}, mockUserId)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own task', async () => {
      mockRepo.findOne.mockResolvedValue({ ...mockTask, user: { id: 'other-user' } });

      await expect(service.update(mockTask.id, {}, mockUserId)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('delete', () => {
    it('should remove the task when user owns it', async () => {
      mockRepo.findOne.mockResolvedValue(mockTask);
      mockRepo.remove.mockResolvedValue(mockTask);

      const result = await service.delete(mockTask.id, mockUserId);

      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { id: mockTask.id },
        relations: ['user'],
      });
      expect(mockRepo.remove).toHaveBeenCalledWith(mockTask);
      expect(result).toBe(true);
    });

    it('should throw NotFoundException if task not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.delete('nonexistent-id', mockUserId)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own task', async () => {
      mockRepo.findOne.mockResolvedValue({ ...mockTask, user: { id: 'other-user' } });

      await expect(service.delete(mockTask.id, mockUserId)).rejects.toThrow(ForbiddenException);
    });
  });
});
