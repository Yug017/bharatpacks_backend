export default ({ env }) => ({
  url: env("PUBLIC_URL", "https://backend.bharatpacks.com/"),  // public API URL

  host: "0.0.0.0",
  port: env.int("PORT", 1337),

  app: {
    keys: env.array("APP_KEYS", [
      "prodKey1",
      "prodKey2",
      "prodKey3",
      "prodKey4",
    ]),
  },

  proxy: true,
});
