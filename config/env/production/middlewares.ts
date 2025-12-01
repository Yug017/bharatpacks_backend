export default [
  "strapi::errors",

  {
    name: "strapi::cors",
    config: {
      origin: ["https://online.bharatpacks.com/"],  // frontend domain
      headers: "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    },
  },

  "strapi::security",
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
