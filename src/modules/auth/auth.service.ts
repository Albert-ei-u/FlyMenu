import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { moduleStatus } from '../../common/module-status';
import { createOpaqueToken, createSignedToken, hashToken } from '../../common/token';
import { hashPassword, verifyPassword } from '../../common/password';
import { EmailService } from '../../integrations/email/email.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfirmPasswordResetDto } from './dto/confirm-password-reset.dto';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly email: EmailService,
    private readonly prisma: PrismaService,
  ) {}

  status() {
    return moduleStatus('auth', 'Registration, login, JWT sessions, password reset, and account security.');
  }

  async signup(body: SignupDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: body.email } });
    if (existingUser) {
      throw new ConflictException('An account with this email already exists.');
    }

    const user = await this.prisma.user.create({
      data: {
        email: body.email,
        fullName: body.fullName,
        phone: body.phone,
        passwordHash: await hashPassword(body.password),
        customerProfile: {
          create: {},
        },
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return {
      user,
      accessToken: this.createAccessToken(user.id, user.email, user.role),
    };
  }

  async login(body: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: body.email } });
    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
      accessToken: this.createAccessToken(user.id, user.email, user.role),
    };
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { message: 'If that email exists, a reset link has been sent.' };
    }

    const secret = this.config.get<string>('JWT_SECRET', 'dev-secret');
    const rawToken = createOpaqueToken();
    const ttlMinutes = this.config.get<number>('PASSWORD_RESET_TOKEN_TTL_MINUTES', 30);
    const expiresAt = new Date(Date.now() + ttlMinutes * 60_000);

    await this.prisma.passwordResetToken.upsert({
      where: { userId: user.id },
      update: { tokenHash: hashToken(rawToken, secret), expiresAt, usedAt: null },
      create: { userId: user.id, tokenHash: hashToken(rawToken, secret), expiresAt },
    });

    await this.email.send({
      to: email,
      subject: 'Reset your FlyMenu password',
      html: `<p>Use this token to reset your FlyMenu password: <strong>${rawToken}</strong></p>`,
    });
    return { message: 'If that email exists, a reset link has been sent.' };
  }

  async confirmPasswordReset(body: ConfirmPasswordResetDto) {
    const secret = this.config.get<string>('JWT_SECRET', 'dev-secret');
    const tokenHash = hashToken(body.token, secret);
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired password reset token.');
    }

    await this.prisma.user.update({
      where: { id: resetToken.userId },
      data: {
        passwordHash: await hashPassword(body.newPassword),
        passwordResetToken: {
          update: { usedAt: new Date() },
        },
      },
    });

    return { message: 'Password has been reset.' };
  }

  private createAccessToken(id: string, email: string, role: string) {
    const secret = this.config.get<string>('JWT_SECRET', 'dev-secret');
    return createSignedToken({ sub: id, email, role, issuedAt: new Date().toISOString() }, secret);
  }
}
