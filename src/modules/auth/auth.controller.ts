import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ConfirmPasswordResetDto } from './dto/confirm-password-reset.dto';
import { LoginDto } from './dto/login.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { SignupDto } from './dto/signup.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @ApiOperation({ summary: 'Module status', description: 'Check auth module status.' })
  status() {
    return this.authService.status();
  }

  @Post('signup')
  @ApiOperation({ summary: 'Sign up', description: 'Register a new user account. A customer profile is created automatically.' })
  @ApiResponse({ status: 201, description: 'Account created. Returns user details and a signed JWT access token.' })
  @ApiResponse({ status: 409, description: 'An account with this email already exists.' })
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in', description: 'Authenticate with email and password. Returns a signed JWT access token.' })
  @ApiResponse({ status: 200, description: 'Login successful. Returns user profile and access token.' })
  @ApiResponse({ status: 401, description: 'Invalid email or password.' })
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('password-reset/request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset', description: 'Send a password reset token to the provided email address.' })
  @ApiResponse({ status: 200, description: 'Reset email sent (returns generic message regardless of email existence).' })
  requestPasswordReset(@Body() body: RequestPasswordResetDto) {
    return this.authService.requestPasswordReset(body.email);
  }

  @Post('password-reset/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm password reset', description: 'Reset password using the token received by email.' })
  @ApiResponse({ status: 200, description: 'Password has been reset successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid or expired password reset token.' })
  confirmPasswordReset(@Body() body: ConfirmPasswordResetDto) {
    return this.authService.confirmPasswordReset(body);
  }
}

