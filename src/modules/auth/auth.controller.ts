import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ConfirmPasswordResetDto } from './dto/confirm-password-reset.dto';
import { LoginDto } from './dto/login.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { SignupDto } from './dto/signup.dto';
import { RestaurantSignupDto } from './dto/restaurant-signup.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

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
  @ApiOperation({
    summary: 'Sign up',
    description:
      'Register a new user account. A 6-digit verification code is sent to the provided email. ' +
      'The account must be verified via POST /auth/verify-email before login is allowed.',
  })
  @ApiResponse({ status: 201, description: 'Account created. Verification code sent to email.' })
  @ApiResponse({ status: 409, description: 'An account with this email already exists.' })
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Post('restaurant/signup')
  @ApiOperation({
    summary: 'Restaurant Admin Sign up',
    description: 'Register a new restaurant admin account and create a draft restaurant.',
  })
  @ApiResponse({ status: 201, description: 'Account created. Verification code sent to email.' })
  @ApiResponse({ status: 409, description: 'An account with this email already exists.' })
  restaurantSignup(@Body() body: RestaurantSignupDto) {
    return this.authService.restaurantSignup(body);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify email',
    description: 'Submit the 6-digit code received by email to verify the account. Returns a JWT on success.',
  })
  @ApiResponse({ status: 200, description: 'Email verified. Returns user details and access token.' })
  @ApiResponse({ status: 400, description: 'Email already verified.' })
  @ApiResponse({ status: 401, description: 'Invalid or expired verification code.' })
  @ApiResponse({ status: 404, description: 'No account found with that email.' })
  verifyEmail(@Body() body: VerifyEmailDto) {
    return this.authService.verifyEmail(body);
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Resend verification code',
    description: 'Request a fresh 6-digit verification code if the previous one expired.',
  })
  @ApiResponse({ status: 200, description: 'New code sent (or generic message if email not found).' })
  @ApiResponse({ status: 400, description: 'Email is already verified.' })
  resendVerification(@Body() body: ResendVerificationDto) {
    return this.authService.resendVerificationCode(body.email);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Log in',
    description: 'Authenticate with email and password. Email must be verified first.',
  })
  @ApiResponse({ status: 200, description: 'Login successful. Returns user profile and access token.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials or email not yet verified.' })
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('password-reset/request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset', description: 'Send a password reset token to the provided email address. Email must be verified.' })
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
