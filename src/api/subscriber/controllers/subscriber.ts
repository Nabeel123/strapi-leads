import { factories } from '@strapi/strapi';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AUTOREPLY_SUBJECT = 'Thankyou for Subscribing';
const AUTOREPLY_BODY = 'Testing body';

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

      // Send autoreply via nodemailer (non-blocking; don't fail subscription if email fails)
      strapi.plugin('email').service('email').send({
        to: trimmed,
        subject: AUTOREPLY_SUBJECT,
        text: AUTOREPLY_BODY,
        html: `<p>${AUTOREPLY_BODY}</p>`,
      }).catch((err: Error) => {
        strapi.log.warn('Subscriber autoreply email failed:', err?.message ?? err);
      });

      ctx.status = 201;
      ctx.body = { data: doc, message: 'Subscribed successfully' };
    } catch (err) {
      strapi.log.error('Subscriber submit error:', err);
      ctx.status = 500;
      ctx.body = { error: { message: 'Failed to subscribe' } };
    }
  },
}));
