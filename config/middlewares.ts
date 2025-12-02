export default [
  'strapi::logger',
  'strapi::errors',

  // ✅ CORS FIX (FULL WORKING CONFIG)
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        'http://localhost:3000',         // local development
        'https://bharatpacks.com',       // your frontend domain
        'https://www.bharatpacks.com',
        'https://bharatpacks-frontend.onrender.com'
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      headers: '*',
      expose: ['Content-Disposition'],
    },
  },

  'strapi::security',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
