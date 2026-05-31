import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly config: ConfigService) {}

  async send(input: SendEmailInput) {
    const from = this.config.get<string>('EMAIL_FROM', 'FlyMenu <no-reply@flymenu.local>');
    this.logger.log(`Email queued locally from ${from} to ${input.to}: ${input.subject}`);
    return { accepted: [input.to], from, preview: input.html };
  }
}
