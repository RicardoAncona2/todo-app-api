import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  const mockUser: User = {
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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
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
      userRepositoryMock.create.mockReturnValue(createDto as any);
      userRepositoryMock.save.mockResolvedValue(mockUser);

      const result = await service.create(createDto);
      expect(userRepositoryMock.create).toHaveBeenCalledWith(createDto);
      expect(userRepositoryMock.save).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockUser);
    });
  });
});
