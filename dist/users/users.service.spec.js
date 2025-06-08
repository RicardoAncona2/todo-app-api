"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const users_service_1 = require("./users.service");
const user_entity_1 = require("./entities/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
describe('UsersService', () => {
    let service;
    let repo;
    const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedpassword',
        tasks: [],
    };
    const userRepositoryMock = {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                users_service_1.UsersService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(user_entity_1.User),
                    useValue: userRepositoryMock,
                },
            ],
        }).compile();
        service = module.get(users_service_1.UsersService);
        repo = module.get((0, typeorm_1.getRepositoryToken)(user_entity_1.User));
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('findByEmail', () => {
        it('should return a user if found', async () => {
            userRepositoryMock.findOne.mockResolvedValue(mockUser);
            const result = await service.findByEmail('test@example.com');
            expect(result).toEqual(mockUser);
            expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
        });
        it('should return null if user not found', async () => {
            userRepositoryMock.findOne.mockResolvedValue(null);
            const result = await service.findByEmail('nonexistent@example.com');
            expect(result).toBeNull();
            expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ where: { email: 'nonexistent@example.com' } });
        });
    });
    describe('create', () => {
        it('should create and save a new user', async () => {
            const createDto = { email: 'new@example.com', password: 'hashedpwd', name: 'New User' };
            userRepositoryMock.create.mockReturnValue(createDto);
            userRepositoryMock.save.mockResolvedValue(mockUser);
            const result = await service.create(createDto);
            expect(userRepositoryMock.create).toHaveBeenCalledWith(createDto);
            expect(userRepositoryMock.save).toHaveBeenCalledWith(createDto);
            expect(result).toEqual(mockUser);
        });
    });
});
//# sourceMappingURL=users.service.spec.js.map