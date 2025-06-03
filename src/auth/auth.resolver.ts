import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterUserInput } from './dto/register-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { User } from 'src/users/entities/user.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation(() => User)
  async createUser(@Args('input') input: RegisterUserInput): Promise<User> {
    return this.authService.register(input.email, input.password, input.name);
  }

  @Mutation(() => String)
  async login(@Args('input') input: LoginUserInput): Promise<string> {
    const user = await this.authService.validateUser(input.email, input.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const result = await this.authService.login(user);
    return result.accessToken;
  }

  @Mutation(() => Boolean)
  async logout(@Context() context): Promise<boolean> {
    const authHeader = context.req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) throw new Error('No token provided');
    await this.authService.logout(token);
    return true;
  }
}
