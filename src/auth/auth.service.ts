import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  private tokenBlacklist = new Set<string>();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });


    return { accessToken, refreshToken };
  }

  async register(email: string, password: string, name: string) {
    const hash = await bcrypt.hash(password, 10);
    return this.usersService.create({ email, password: hash, name });
  }

  async logout(token: string) {
    this.tokenBlacklist.add(token);
  }

  isTokenBlacklisted(token: string): boolean {
    return this.tokenBlacklist.has(token);
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);

      const user = await this.usersService.findByEmail(payload.sub);
      if (!user) throw new Error('User not found');

      return this.login(user);
    } catch (e) {
      if (e.message === 'User not found') {
        throw e;
      }
      throw new Error('Invalid refresh token');
    }
  }
}
