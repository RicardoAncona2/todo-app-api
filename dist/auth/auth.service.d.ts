import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private tokenBlacklist;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<{
        id: string;
        email: string;
        name: string;
        tasks: import("../tasks").Task[];
    } | null>;
    login(user: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    register(email: string, password: string, name: string): Promise<import("../users").User>;
    logout(token: string): Promise<void>;
    isTokenBlacklisted(token: string): boolean;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
