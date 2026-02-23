import { factories } from '@strapi/strapi';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_SUBJECT = 'Thanks for subscribing!';
const DEFAULT_BODY = "You're on the list. We'll send you lead gen tips and strategies soon.";

export default factories.createCoreController('api::subscriber.subscriber', ({ strapi }) => ({
  async submit(ctx: { request: { body?: { email?: string; source?: string } }; body?: unknown; status?: number }) {
    const { email, source = 'scroll_modal' } = ctx.request?.body ?? {};

    if (!email || typeof email !== 'string') {
      ctx.status = 400;
      ctx.body = { error: { message: 'Email is required' } };
      return;
    }

    const trimmed = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(trimmed)) {
      ctx.status = 400;
      ctx.body = { error: { message: 'Invalid email format' } };
      return;
    }

    try {
      const docs = strapi.documents('api::subscriber.subscriber');
      const existing = await docs.findFirst({
        filters: { email: { $eq: trimmed } },
      });

      if (existing) {
        ctx.status = 200;
        ctx.body = { message: 'Already subscribed' };
        return;
      }

      const doc = await docs.create({
        data: {
          email: trimmed,
          source: typeof source === 'string' ? source : 'scroll_modal',
          subscribedAt: new Date().toISOString(),
        },
      } as never);

      // Fetch template from email-modal (Strapi CMS)
      const template = (await strapi.documents('api::email-modal.email-modal').findFirst()) as
        | { autoreplySubject?: string; autoreplyBody?: string }
        | null;
      const subject = (template?.autoreplySubject?.trim() || DEFAULT_SUBJECT) as string;
      const body = (template?.autoreplyBody?.trim() || DEFAULT_BODY) as string;

      // Send autoreply from noreply@aiseen.co using template from Strapi (non-blocking)
      const fromAddress = process.env.MAILER_FROM || 'noreply@aiseen.co';
      strapi.plugin('email').service('email').send({
        from: fromAddress,
        to: trimmed,
        subject,
        text: body,
        html: `<p>${body.replace(/\n/g, '</p><p>')}</p>`,
      }).catch((err: Error & { statusCode?: number; body?: { message?: string; errors?: { message?: string }[] } }) => {
        const msg = err?.body?.message ?? err?.body?.errors?.[0]?.message ?? err?.message;
        const code = err?.statusCode ?? err?.status;
        strapi.log.warn(`Subscriber autoreply failed [${code || '?'}]: ${msg || String(err)}`);
        if (err?.body) strapi.log.debug('MailerSend response:', JSON.stringify(err.body));
      });

      ctx.status = 201;
      ctx.body = { data: doc, message: 'Subscribed successfully' };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      strapi.log.error('Subscriber submit error:', err);
      ctx.status = 500;
      ctx.body = {
        data: null,
        error: {
          status: 500,
          name: 'InternalServerError',
          message: process.env.NODE_ENV === 'development' ? message : 'Failed to subscribe',
        },
      };
    }
  },
}));
