import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { moduleStatus } from '../../common/module-status';
import * as path from 'path';
import { hashToken, createOpaqueToken, createOtpCode, createSignedToken } from '../../common/token';
import { hashPassword, verifyPassword } from '../../common/password';
import { EmailService } from '../../integrations/email/email.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfirmPasswordResetDto } from './dto/confirm-password-reset.dto';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { RestaurantSignupDto } from './dto/restaurant-signup.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

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
      },
    });

    await this.sendVerificationCode(user.id, user.email, user.fullName);

    return {
      message: 'Account created. Please check your email for a 6-digit verification code.',
      email: user.email,
    };
  }

  async restaurantSignup(body: RestaurantSignupDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: body.email } });
    if (existingUser) {
      throw new ConflictException('An account with this email already exists.');
    }

    // Convert restaurant name to slug
    const slug = body.restaurantName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const user = await this.prisma.user.create({
      data: {
        email: body.email,
        fullName: body.fullName,
        passwordHash: await hashPassword(body.password),
        role: 'RESTAURANT_OWNER',
        ownedRestaurants: {
          create: {
            name: body.restaurantName,
            slug,
            cuisine: 'Other', // default value
            status: 'DRAFT',
          },
        },
      },
      select: {
        id: true,
        email: true,
        fullName: true,
      },
    });

    await this.sendVerificationCode(user.id, user.email, user.fullName);

    return {
      message: 'Restaurant account created. Please check your email for a 6-digit verification code.',
      email: user.email,
    };
  }

  async verifyEmail(body: VerifyEmailDto) {
    const user = await this.prisma.user.findUnique({ where: { email: body.email } });
    if (!user) throw new NotFoundException('No account found with that email.');
    if (user.emailVerified) throw new BadRequestException('This email is already verified.');

    const secret = this.config.get<string>('JWT_SECRET', 'dev-secret');
    const tokenHash = hashToken(body.code, secret);

    const record = await this.prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
    });

    if (!record || record.userId !== user.id || record.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired verification code.');
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true, emailVerifiedAt: new Date() },
      }),
      this.prisma.emailVerificationToken.delete({ where: { id: record.id } }),
    ]);

    return {
      message: 'Email verified successfully. You can now log in.',
      accessToken: this.createAccessToken(user.id, user.email, user.role),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        emailVerified: true,
      },
    };
  }

  async resendVerificationCode(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Generic response to avoid user enumeration
      return { message: 'If that account exists and is unverified, a new code has been sent.' };
    }
    if (user.emailVerified) {
      throw new BadRequestException('This email is already verified.');
    }

    await this.sendVerificationCode(user.id, user.email, user.fullName);
    return { message: 'A new verification code has been sent to your email.' };
  }

  async login(body: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: body.email } });
    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in. Check your inbox for the 6-digit code.',
      );
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
        emailVerified: user.emailVerified,
      },
      accessToken: this.createAccessToken(user.id, user.email, user.role),
    };
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { message: 'If that email exists, a reset link has been sent.' };
    }

    if (!user.emailVerified) {
      throw new BadRequestException(
        'Please verify your email address before requesting a password reset.',
      );
    }

    const secret = this.config.get<string>('JWT_SECRET', 'dev-secret');
    const rawToken = createOtpCode();
    const ttlMinutes = this.config.get<number>('PASSWORD_RESET_TOKEN_TTL_MINUTES', 30);
    const expiresAt = new Date(Date.now() + ttlMinutes * 60_000);

    await this.prisma.passwordResetToken.upsert({
      where: { userId: user.id },
      update: { tokenHash: hashToken(rawToken, secret), expiresAt, usedAt: null },
      create: { userId: user.id, tokenHash: hashToken(rawToken, secret), expiresAt },
    });

    const resetHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#0f172a;padding:32px 40px;text-align:center;">
            <img src="cid:flymenu-logo" alt="FlyMenu Logo" width="44" height="44" style="margin:0 auto 12px;display:block;" />
            <h1 style="color:#f97316;margin:0;font-size:28px;letter-spacing:-1px;">FlyMenu</h1>
            <p style="color:#94a3b8;margin:8px 0 0;font-size:14px;">Restaurant Management Platform</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <h2 style="color:#0f172a;margin:0 0 16px;font-size:22px;">Password Reset Request</h2>
            <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 28px;">
              We received a request to reset the password for your FlyMenu account.
              Enter the code below to complete the reset. It expires in <strong>${ttlMinutes} minutes</strong>.
            </p>
            <div style="background:#f8fafc;border:2px solid #f97316;border-radius:12px;padding:28px;text-align:center;margin:0 0 28px;">
              <p style="color:#64748b;font-size:12px;margin:0 0 10px;text-transform:uppercase;letter-spacing:2px;font-weight:600;">Your Reset Code</p>
              <div style="color:#0f172a;font-size:40px;font-weight:800;letter-spacing:10px;font-family:monospace;">${rawToken}</div>
            </div>
            <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin:0;">
              If you did not request a password reset, you can safely ignore this email.
              Your password will not be changed.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="color:#94a3b8;font-size:12px;margin:0;">
              &copy; ${new Date().getFullYear()} FlyMenu &middot; This is an automated message, please do not reply.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    await this.email.send({
      to: email,
      subject: 'Reset your FlyMenu password',
      html: resetHtml,
      attachments: [{
        filename: 'flymenu-logo.png',
        path: path.join(process.cwd(), 'src/assets/flymenu-logo.png'),
        cid: 'flymenu-logo'
      }]
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

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private async sendVerificationCode(userId: string, email: string, fullName: string) {
    const secret = this.config.get<string>('JWT_SECRET', 'dev-secret');
    const code = createOtpCode();
    const ttlMinutes = this.config.get<number>('VERIFICATION_CODE_TTL_MINUTES', 15);
    const expiresAt = new Date(Date.now() + ttlMinutes * 60_000);

    await this.prisma.emailVerificationToken.upsert({
      where: { userId },
      update: { tokenHash: hashToken(code, secret), expiresAt },
      create: { userId, tokenHash: hashToken(code, secret), expiresAt },
    });

    const firstName = fullName.split(' ')[0] ?? fullName;

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#0f172a;padding:32px 40px;text-align:center;">
            <img src="cid:flymenu-logo" alt="FlyMenu Logo" width="44" height="44" style="margin:0 auto 12px;display:block;" />
            <h1 style="color:#f97316;margin:0;font-size:28px;letter-spacing:-1px;">FlyMenu</h1>
            <p style="color:#94a3b8;margin:8px 0 0;font-size:14px;">Restaurant Management Platform</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <h2 style="color:#0f172a;margin:0 0 8px;font-size:22px;">Welcome, ${firstName}! 👋</h2>
            <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 28px;">
              Thanks for creating your FlyMenu account. Enter the code below to verify your email address.
              This code expires in <strong>${ttlMinutes} minutes</strong>.
            </p>
            <div style="background:#f8fafc;border:2px solid #f97316;border-radius:12px;padding:28px;text-align:center;margin:0 0 28px;">
              <p style="color:#64748b;font-size:12px;margin:0 0 10px;text-transform:uppercase;letter-spacing:2px;font-weight:600;">Your Verification Code</p>
              <div style="color:#0f172a;font-size:40px;font-weight:800;letter-spacing:10px;font-family:monospace;">${code}</div>
            </div>
            <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin:0;">
              Didn't create an account? You can safely ignore this email.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="color:#94a3b8;font-size:12px;margin:0;">
              &copy; ${new Date().getFullYear()} FlyMenu &middot; This is an automated message, please do not reply.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    await this.email.send({
      to: email,
      subject: `${code} is your FlyMenu verification code`,
      html,
      attachments: [{
        filename: 'flymenu-logo.png',
        path: path.join(process.cwd(), 'src/assets/flymenu-logo.png'),
        cid: 'flymenu-logo'
      }]
    });
  }

  private createAccessToken(id: string, email: string, role: string) {
    const secret = this.config.get<string>('JWT_SECRET', 'dev-secret');
    return createSignedToken({ sub: id, email, role, issuedAt: new Date().toISOString() }, secret);
  }
}
