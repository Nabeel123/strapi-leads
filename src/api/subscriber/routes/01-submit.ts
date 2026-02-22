/** @type {import('@strapi/strapi').Core.RouterConfig} */
export default {
  type: 'content-api',
  routes: [
    {
      method: 'POST',
      path: '/subscribers/submit',
      handler: 'api::subscriber.subscriber.submit',
      config: {
        auth: false,
      },
    },
  ],
};
