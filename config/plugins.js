'use strict';

/**
 * Strapi email plugin configuration for MailerSend SMTP.
 * Reads SMTP credentials from environment variables.
 * Kept in plain JS for compatibility with deployment platforms.
 */
module.exports = ({ env }) => {
  const smtpUser = env('SMTP_USERNAME') || process.env.SMTP_USERNAME;
  const smtpPass = env('SMTP_PASSWORD') || process.env.SMTP_PASSWORD;
  const apiKey = env('MAILERSEND_API_KEY') || process.env.MAILERSEND_API_KEY;
  const from = env('MAILER_FROM') || process.env.MAILER_FROM || 'noreply@aiseen.co';

  // Prefer Nodemailer SMTP when credentials are set (MailerSend SMTP)
  if (smtpUser && smtpPass) {
    return {
      email: {
        config: {
          provider: 'nodemailer',
          providerOptions: {
            host: env('SMTP_HOST') || process.env.SMTP_HOST || 'smtp.mailersend.net',
            port: parseInt(env('SMTP_PORT') || process.env.SMTP_PORT || '587', 10),
            secure: false,
            requireTLS: true,
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
            tls: {
              rejectUnauthorized: env.bool('SMTP_TLS_REJECT_UNAUTHORIZED', true),
            },
          },
          settings: {
            defaultFrom: from,
            defaultReplyTo: from,
          },
        },
      },
    };
  }

  // Fallback: MailerSend API when SMTP not configured
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

  // No credentials - minimal config (emails will fail until SMTP_* or MAILERSEND_API_KEY is set)
  return {
    email: {
      config: {
        provider: 'nodemailer',
        providerOptions: {
          host: env('SMTP_HOST') || process.env.SMTP_HOST || 'smtp.mailersend.net',
          port: parseInt(env('SMTP_PORT') || process.env.SMTP_PORT || '587', 10),
        },
        settings: { defaultFrom: from, defaultReplyTo: from },
      },
    },
  };
};
