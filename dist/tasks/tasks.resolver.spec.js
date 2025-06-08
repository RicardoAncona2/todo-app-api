"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const tasks_resolver_1 = require("./tasks.resolver");
const tasks_service_1 = require("./tasks.service");
const task_entity_1 = require("./entities/task.entity");
describe('TasksResolver', () => {
    let resolver;
    let tasksService;
    const mockUser = {
        id: 'user-1',
        email: 'user@test.com',
        name: 'User',
        password: 'hashed',
        tasks: [],
    };
    const now = new Date();
    const mockTasks = [
        {
            id: 'task-1',
            title: 'Task 1',
            description: 'Desc 1',
            status: task_entity_1.TaskStatus.PENDING,
            createdAt: now,
            updatedAt: now,
            user: mockUser,
        },
        {
            id: 'task-2',
            title: 'Task 2',
            description: 'Desc 2',
            status: task_entity_1.TaskStatus.PENDING,
            createdAt: now,
            updatedAt: now,
            user: mockUser,
        },
    ];
    const mockTask = {
        id: 'task-3',
        title: 'Task 3',
        description: 'Desc 3',
        status: task_entity_1.TaskStatus.PENDING,
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
        const module = await testing_1.Test.createTestingModule({
            providers: [
                tasks_resolver_1.TasksResolver,
                { provide: tasks_service_1.TasksService, useValue: mockTasksService },
            ],
        }).compile();
        resolver = module.get(tasks_resolver_1.TasksResolver);
        tasksService = module.get(tasks_service_1.TasksService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('findAll (myTasks)', () => {
        it('should return tasks for the user', async () => {
            const result = await resolver.findAll(mockUser);
            expect(tasksService.findTasksByUser).toHaveBeenCalledWith(mockUser.id);
            expect(result).toEqual(mockTasks);
        });
    });
    describe('createTask', () => {
        it('should create a task with user id', async () => {
            const input = {
                title: 'Task 3', description: 'Desc 3',
                status: task_entity_1.TaskStatus.PENDING
            };
            const result = await resolver.createTask(input, mockUser);
            expect(tasksService.create).toHaveBeenCalledWith(input, mockUser.id);
            expect(result).toEqual(mockTask);
        });
    });
    describe('updateTask', () => {
        it('should update a task by id and user', async () => {
            const input = { title: 'Updated Task', description: 'Updated Desc' };
            const taskId = 'task-3';
            const result = await resolver.updateTask(taskId, input, mockUser);
            expect(tasksService.update).toHaveBeenCalledWith(taskId, input, mockUser.id);
            expect(result).toEqual(mockTask);
        });
    });
    describe('deleteTask', () => {
        it('should delete a task by id and user', async () => {
            const taskId = 'task-3';
            const result = await resolver.deleteTask(taskId, mockUser);
            expect(tasksService.delete).toHaveBeenCalledWith(taskId, mockUser.id);
            expect(result).toBe(true);
        });
    });
});
//# sourceMappingURL=tasks.resolver.spec.js.map