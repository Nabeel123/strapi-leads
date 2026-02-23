import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => {
  const apiKey = env('MAILERSEND_API_KEY') || process.env.MAILERSEND_API_KEY;
  const smtpUser = env('SMTP_USERNAME') || process.env.SMTP_USERNAME;
  const smtpPass = env('SMTP_PASSWORD') || process.env.SMTP_PASSWORD;
  const from = env('MAILER_FROM') || process.env.MAILER_FROM || 'noreply@aiseen.co';

  // Prefer Nodemailer SMTP when credentials are set (works better for real recipients;
  // MailerSend API can restrict unverified recipients). Fall back to MailerSend API only if SMTP not configured.
  if (smtpUser && smtpPass) {
    const providerOptions: Record<string, unknown> = {
      host: env('SMTP_HOST', 'smtp.mailersend.net'),
      port: env.int('SMTP_PORT', 587),
      secure: false,
      requireTLS: true,
      auth: { user: smtpUser, pass: smtpPass },
      tls: { rejectUnauthorized: env.bool('SMTP_TLS_REJECT_UNAUTHORIZED', true) },
    };

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
  }

  // MailerSend API (when SMTP not configured but MAILERSEND_API_KEY is set)
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

  // No SMTP or API key - emails will fail; user should configure SMTP_* or MAILERSEND_API_KEY
  return {
    email: {
      config: {
        provider: 'nodemailer',
        providerOptions: {
          host: env('SMTP_HOST', 'smtp.mailersend.net'),
          port: env.int('SMTP_PORT', 587),
        },
        settings: { defaultFrom: from, defaultReplyTo: from },
      },
    },
  };
};

export default config;
