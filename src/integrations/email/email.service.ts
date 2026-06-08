import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: any[];
};

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private transporter!: Transporter;
  private isEthereal = false;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const smtpUser = this.config.get<string>('SMTP_USER', '');
    const smtpPass = this.config.get<string>('SMTP_PASSWORD', '');

    if (smtpUser && smtpPass) {
      // Real SMTP transporter
      this.transporter = nodemailer.createTransport({
        host: this.config.get<string>('SMTP_HOST', 'smtp.gmail.com'),
        port: this.config.get<number>('SMTP_PORT', 587),
        secure: this.config.get<string>('SMTP_SECURE', 'false') === 'true',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
      try {
        await this.transporter.verify();
        this.logger.log(`✅ Email service ready → SMTP (${this.config.get('SMTP_HOST')}:${this.config.get('SMTP_PORT')})`);
      } catch (err: any) {
        this.logger.error(`❌ SMTP verification failed: ${err.message}. Email delivery may not work.`);
      }
    } else {
      // Auto-generate Ethereal test account for local dev
      this.isEthereal = true;
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      this.logger.warn('📧 No SMTP credentials found — using Ethereal test account for email preview.');
      this.logger.warn(`   Ethereal inbox: https://ethereal.email/login  user=${testAccount.user}  pass=${testAccount.pass}`);
    }
  }

  async send(input: SendEmailInput): Promise<void> {
    const from = this.config.get<string>('EMAIL_FROM', 'FlyMenu <no-reply@flymenu.local>');

    const info = await this.transporter.sendMail({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text ?? input.html.replace(/<[^>]*>/g, ''),
      attachments: input.attachments,
    });

    if (this.isEthereal) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      this.logger.log(`📩 Email sent to ${input.to} — Preview: ${previewUrl}`);
    } else {
      this.logger.log(`📩 Email sent to ${input.to} (messageId: ${info.messageId})`);
    }
  }
}

