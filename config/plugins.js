'use strict';

/**
 * Strapi email plugin configuration for MailerSend.
 * See: https://docs.strapi.io/cms/features/email
 *
 * Option 1 (preferred): MailerSend API - set MAILERSEND_API_KEY
 * Option 2: Nodemailer + MailerSend SMTP - set SMTP_USERNAME, SMTP_PASSWORD
 */
module.exports = ({ env }) => {
  const apiKey = env('MAILERSEND_API_KEY') || process.env.MAILERSEND_API_KEY;
  const smtpUser = env('SMTP_USERNAME') || process.env.SMTP_USERNAME;
  const smtpPass = env('SMTP_PASSWORD') || process.env.SMTP_PASSWORD;
  const from = env('MAILER_FROM') || process.env.MAILER_FROM || 'noreply@aiseen.co';

  // MailerSend API (preferred when API key is set)
  if (apiKey) {
    return {
      email: {
        config: {
          provider: 'strapi-provider-email-mailersend',
          providerOptions: {
            apiKey,
          },
          settings: {
            defaultFrom: from,
            defaultReplyTo: from,
          },
        },
      },
    };
  }

  // Nodemailer + MailerSend SMTP
  if (smtpUser && smtpPass) {
    return {
      email: {
        config: {
          provider: 'nodemailer',
          providerOptions: {
            host: env('SMTP_HOST') || process.env.SMTP_HOST || 'smtp.mailersend.net',
            port: env.int ? env.int('SMTP_PORT', 587) : parseInt(process.env.SMTP_PORT || '587', 10),
            secure: false,
            requireTLS: true,
            auth: {
              user: smtpUser,
              pass: smtpPass,
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

  return {
    email: {
      config: {
        provider: 'nodemailer',
        providerOptions: {
          host: env('SMTP_HOST') || process.env.SMTP_HOST || 'smtp.mailersend.net',
          port: env.int ? env.int('SMTP_PORT', 587) : 587,
        },
        settings: { defaultFrom: from, defaultReplyTo: from },
      },
    },
  };
};
