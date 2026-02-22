'use strict';

/**
 * Sets public find/findOne permissions for all API content types.
 * Run this if content from the backend is not visible on the frontend.
 *
 * Usage: npm run set-permissions (or node scripts/set-permissions.js)
 */

const PERMISSIONS = {
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

async function setPublicPermissions() {
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });

  if (!publicRole) {
    console.error('Public role not found.');
    return;
  }

  const existing = await strapi.query('plugin::users-permissions.permission').findMany({
    where: { role: publicRole.id },
  });
  const existingActions = new Set(existing.map((p) => p.action));

  let created = 0;
  for (const [controller, actions] of Object.entries(PERMISSIONS)) {
    for (const action of actions) {
      const actionName = `api::${controller}.${controller}.${action}`;
      if (existingActions.has(actionName)) continue;
      await strapi.query('plugin::users-permissions.permission').create({
        data: { action: actionName, role: publicRole.id },
      });
      created++;
      console.log('Created:', actionName);
    }
  }

  console.log(`Done. Created ${created} permission(s).`);
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';
  await setPublicPermissions();
  await app.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
