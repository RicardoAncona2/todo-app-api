import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { RegisterUserInput, LoginUserInput, AuthPayload } from './dto';
import { User } from '@users/entities';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthService;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedpassword',
    tasks: [],
  };

  const mockAuthPayload: AuthPayload = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
  };

  const mockAuthService = {
    register: jest.fn().mockResolvedValue(mockUser),
    validateUser: jest.fn().mockResolvedValue(mockUser),
    login: jest.fn().mockResolvedValue(mockAuthPayload),
    logout: jest.fn().mockResolvedValue(true),
    refreshTokens: jest.fn().mockResolvedValue(mockAuthPayload),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
  });

  it('should register a user', async () => {
    const input: RegisterUserInput = {
      email: 'test@example.com',
      password: '12345678',
      name: 'Test User',
    };
    await expect(resolver.createUser(input)).resolves.toEqual(mockUser);
    expect(mockAuthService.register).toHaveBeenCalledWith(
      input.email,
      input.password,
      input.name,
    );
  });

  it('should login a user and return tokens', async () => {
    const input: LoginUserInput = {
      email: 'test@example.com',
      password: '12345678',
    };
    await expect(resolver.login(input)).resolves.toEqual(mockAuthPayload);
    expect(mockAuthService.validateUser).toHaveBeenCalledWith(
      input.email,
      input.password,
    );
    expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
  });

  it('should logout user', async () => {
    const context = {
      req: { headers: { authorization: 'Bearer dummy-token' } },
    };
    await expect(resolver.logout(context)).resolves.toBe(true);
    expect(authService.logout).toHaveBeenCalledWith('dummy-token');
  });

  it('should refresh token', async () => {
    await expect(resolver.refreshToken('refresh-token')).resolves.toEqual(
      mockAuthPayload,
    );
    expect(authService.refreshTokens).toHaveBeenCalledWith('refresh-token');
  });
});
