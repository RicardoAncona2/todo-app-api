import { AuthService } from './auth.service';
import { User } from '@users/entities';
import { AuthPayload, LoginUserInput, RegisterUserInput } from './dto';
export declare class AuthResolver {
    private readonly authService;
    constructor(authService: AuthService);
    createUser(input: RegisterUserInput): Promise<User>;
    login(input: LoginUserInput): Promise<AuthPayload>;
    logout(context: any): Promise<boolean>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
