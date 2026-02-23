import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.mailersend.net'),
        port: env.int('SMTP_PORT', 587),
        secure: false, // Port 587 uses STARTTLS, not implicit TLS
        requireTLS: true, // MailerSend requires STARTTLS on 587
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
        tls: {
          rejectUnauthorized: env.bool('SMTP_TLS_REJECT_UNAUTHORIZED', true),
        },
      },
      settings: {
        defaultFrom: env('MAILER_FROM', 'noreply@example.com'),
        defaultReplyTo: env('MAILER_FROM', 'noreply@example.com'),
      },
    },
  },
});

export default config;
