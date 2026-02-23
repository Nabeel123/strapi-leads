import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => {
  const apiKey = env('MAILERSEND_API_KEY');
  const from = env('MAILER_FROM', 'noreply@aiseen.co');

  // Use MailerSend API (more reliable than SMTP; get API key from Settings → API Tokens)
  if (apiKey) {
    return {
      email: {
        config: {
          provider: 'strapi-provider-email-mailersend',
          providerOptions: { apiKey },
          settings: {
            defaultFrom: from,
            defaultReplyTo: from,
          },
        },
      },
    };
  }

  // Fallback to nodemailer SMTP if MAILERSEND_API_KEY not set
  const user = env('SMTP_USERNAME');
  const pass = env('SMTP_PASSWORD');
  const providerOptions: Record<string, unknown> = {
    host: env('SMTP_HOST', 'smtp.mailersend.net'),
    port: env.int('SMTP_PORT', 587),
    secure: false,
    requireTLS: true,
    tls: { rejectUnauthorized: env.bool('SMTP_TLS_REJECT_UNAUTHORIZED', true) },
  };
  if (user && pass) {
    providerOptions.auth = { user, pass };
  }

  return {
    email: {
      config: {
        provider: 'nodemailer',
        providerOptions,
        settings: {
          defaultFrom: from,
          defaultReplyTo: from,
        },
      },
    },
  };
};

export default config;
