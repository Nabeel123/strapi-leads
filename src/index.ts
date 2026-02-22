import type { Core } from '@strapi/strapi';
import path from 'path';
import fs from 'fs';

const SECTION_ENTRIES: Array<{ model: string; key: string }> = [
  { model: 'capabilities', key: 'sections.capabilities' },
  { model: 'how-it-works', key: 'sections.how-it-works' },
  { model: 'why-choose', key: 'sections.why-choose' },
  { model: 'testimonials', key: 'sections.testimonials' },
  { model: 'use-cases', key: 'sections.use-cases' },
  { model: 'pricing', key: 'sections.pricing' },
  { model: 'guarantee', key: 'sections.guarantee' },
  { model: 'final-cta', key: 'sections.final-cta' },
  { model: 'contact', key: 'contact' },
  { model: 'terms', key: 'terms' },
  { model: 'privacy-policy', key: 'privacyPolicy' },
  { model: 'email-modal', key: 'emailModal' },
];

async function seedEmptySections(strapi: Core.Strapi) {
  const dataPath = path.join(process.cwd(), 'data', 'data.json');
  if (!fs.existsSync(dataPath)) return;

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as Record<string, unknown>;

  for (const { model, key } of SECTION_ENTRIES) {
    try {
      const uid = `api::${model}.${model}`;
      const docs = strapi.documents(uid as 'api::pricing.pricing');
      const existing = await docs.findFirst();
      if (existing) continue;

      const keyPath = key.split('.');
      let entry: unknown = data;
      for (const k of keyPath) {
        entry = (entry as Record<string, unknown>)?.[k];
      }
      if (!entry || typeof entry !== 'object') continue;

      // Data from JSON matches schema; type assertion needed for dynamic model
      await docs.create({ data: entry } as never);
      strapi.log.info(`[bootstrap] Seeded empty section: ${model}`);
    } catch (err) {
      strapi.log.warn(`[bootstrap] Could not seed ${model}:`, err);
    }
  }
}

async function ensurePublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });
  if (!publicRole) return;

  const existing = await strapi.query('plugin::users-permissions.permission').findMany({
    where: { role: publicRole.id },
  });
  const existingActions = new Set(existing.map((p: { action: string }) => p.action));

  const PERMISSIONS: Record<string, string[]> = {
    article: ['find', 'findOne'],
    category: ['find', 'findOne'],
    author: ['find', 'findOne'],
    global: ['find', 'findOne'],
    about: ['find', 'findOne'],
    capabilities: ['find', 'findOne'],
    'how-it-works': ['find', 'findOne'],
    'why-choose': ['find', 'findOne'],
    testimonials: ['find', 'findOne'],
    'use-cases': ['find', 'findOne'],
    pricing: ['find', 'findOne'],
    guarantee: ['find', 'findOne'],
    'final-cta': ['find', 'findOne'],
    contact: ['find', 'findOne'],
    terms: ['find', 'findOne'],
    'privacy-policy': ['find', 'findOne'],
    'email-modal': ['find'],
  };

  for (const [controller, actions] of Object.entries(PERMISSIONS)) {
    for (const action of actions) {
      const actionName = `api::${controller}.${controller}.${action}`;
      if (existingActions.has(actionName)) continue;
      await strapi.query('plugin::users-permissions.permission').create({
        data: { action: actionName, role: publicRole.id },
      });
      strapi.log.info(`[bootstrap] Created permission: ${actionName}`);
    }
  }
}

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await seedEmptySections(strapi);
    await ensurePublicPermissions(strapi);
  },
};
