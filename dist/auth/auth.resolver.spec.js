"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_resolver_1 = require("./auth.resolver");
const auth_service_1 = require("./auth.service");
describe('AuthResolver', () => {
    let resolver;
    let authService;
    const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedpassword',
        tasks: [],
    };
    const mockAuthPayload = {
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
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_resolver_1.AuthResolver,
                { provide: auth_service_1.AuthService, useValue: mockAuthService },
            ],
        }).compile();
        resolver = module.get(auth_resolver_1.AuthResolver);
        authService = module.get(auth_service_1.AuthService);
    });
    it('should register a user', async () => {
        const input = {
            email: 'test@example.com',
            password: '12345678',
            name: 'Test User',
        };
        await expect(resolver.createUser(input)).resolves.toEqual(mockUser);
        expect(mockAuthService.register).toHaveBeenCalledWith(input.email, input.password, input.name);
    });
    it('should login a user and return tokens', async () => {
        const input = {
            email: 'test@example.com',
            password: '12345678',
        };
        await expect(resolver.login(input)).resolves.toEqual(mockAuthPayload);
        expect(mockAuthService.validateUser).toHaveBeenCalledWith(input.email, input.password);
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
        await expect(resolver.refreshToken('refresh-token')).resolves.toEqual(mockAuthPayload);
        expect(authService.refreshTokens).toHaveBeenCalledWith('refresh-token');
    });
});
//# sourceMappingURL=auth.resolver.spec.js.map