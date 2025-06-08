"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_service_1 = require("./auth.service");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
describe('AuthService', () => {
    let authService;
    let usersService;
    let jwtService;
    const mockUsersService = {
        findByEmail: jest.fn(),
        create: jest.fn(),
    };
    const mockJwtService = {
        sign: jest.fn(),
        verify: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                { provide: users_service_1.UsersService, useValue: mockUsersService },
                { provide: jwt_1.JwtService, useValue: mockJwtService },
            ],
        }).compile();
        authService = module.get(auth_service_1.AuthService);
        usersService = module.get(users_service_1.UsersService);
        jwtService = module.get(jwt_1.JwtService);
        jest.clearAllMocks();
    });
    describe('validateUser', () => {
        it('returns user data without password when credentials are valid', async () => {
            const password = 'password123';
            const hashed = await bcrypt.hash(password, 10);
            const user = { id: '1', email: 'test@test.com', password: hashed, name: 'Test' };
            mockUsersService.findByEmail.mockResolvedValue(user);
            const result = await authService.validateUser(user.email, password);
            expect(result).toEqual({ id: '1', email: 'test@test.com', name: 'Test' });
        });
        it('returns null if user not found', async () => {
            mockUsersService.findByEmail.mockResolvedValue(null);
            const result = await authService.validateUser('missing@test.com', 'password');
            expect(result).toBeNull();
        });
        it('returns null if password is incorrect', async () => {
            const user = { id: '1', email: 'test@test.com', password: await bcrypt.hash('rightpass', 10), name: 'Test' };
            mockUsersService.findByEmail.mockResolvedValue(user);
            const result = await authService.validateUser(user.email, 'wrongpass');
            expect(result).toBeNull();
        });
    });
    describe('login', () => {
        it('returns access and refresh tokens', async () => {
            const user = { id: '1', email: 'test@test.com' };
            mockJwtService.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');
            const tokens = await authService.login(user);
            expect(tokens).toEqual({ accessToken: 'access-token', refreshToken: 'refresh-token' });
            expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
        });
    });
    describe('register', () => {
        it('hashes password and calls usersService.create', async () => {
            const email = 'new@test.com';
            const password = 'password123';
            const name = 'New User';
            mockUsersService.create.mockImplementation((user) => Promise.resolve({ id: '1', ...user }));
            const user = await authService.register(email, password, name);
            expect(mockUsersService.create).toHaveBeenCalled();
            expect(user).toMatchObject({ email, name });
            expect(typeof user.password).toBe('string');
            expect(user.password).not.toBe(password);
        });
    });
    describe('logout & token blacklist', () => {
        it('adds token to blacklist and checks it', () => {
            const token = 'some-token';
            authService.logout(token);
            expect(authService.isTokenBlacklisted(token)).toBe(true);
            expect(authService.isTokenBlacklisted('other-token')).toBe(false);
        });
    });
    describe('refreshTokens', () => {
        it('verifies refresh token and returns new tokens', async () => {
            const refreshToken = 'refresh-token';
            const payload = { sub: 'test@test.com', email: 'test@test.com' };
            const user = { id: '1', email: 'test@test.com', password: 'hashed', name: 'Test' };
            mockJwtService.verify.mockReturnValue(payload);
            mockUsersService.findByEmail.mockResolvedValue(user);
            mockJwtService.sign.mockReturnValueOnce('new-access-token').mockReturnValueOnce('new-refresh-token');
            const tokens = await authService.refreshTokens(refreshToken);
            expect(mockJwtService.verify).toHaveBeenCalledWith(refreshToken);
            expect(mockUsersService.findByEmail).toHaveBeenCalledWith(payload.sub);
            expect(tokens).toEqual({ accessToken: 'new-access-token', refreshToken: 'new-refresh-token' });
        });
        it('throws error on invalid refresh token', async () => {
            mockJwtService.verify.mockImplementation(() => { throw new Error('Invalid token'); });
            await expect(authService.refreshTokens('bad-token')).rejects.toThrow('Invalid refresh token');
        });
        it('throws error if user not found', async () => {
            mockJwtService.verify.mockReturnValue({ sub: 'missing@test.com' });
            mockUsersService.findByEmail.mockResolvedValue(null);
            await expect(authService.refreshTokens('valid-token')).rejects.toThrow('User not found');
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map