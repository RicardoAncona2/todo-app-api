import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';
import { AuthPayload, LoginUserInput, RegisterUserInput } from './dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation(() => User)
  async createUser(@Args('input') input: RegisterUserInput): Promise<User> {
    return this.authService.register(input.email, input.password, input.name);
  }

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginUserInput): Promise<AuthPayload> {
    const user = await this.authService.validateUser(input.email, input.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService.login(user);
  }


  @Mutation(() => Boolean)
  async logout(@Context() context): Promise<boolean> {
    const authHeader = context.req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) throw new Error('No token provided');
    await this.authService.logout(token);
    return true;
  }
  @Mutation(() => String)
  async refreshToken(@Args('refreshToken') refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.refreshTokens(refreshToken);
  }
}
