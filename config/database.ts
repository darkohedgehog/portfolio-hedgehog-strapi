import path from "path";

type Client = "sqlite" | "postgres" | "mysql";

export default ({ env }) => {
  const rawClient = env("DATABASE_CLIENT", "sqlite");
  const client: Client = (["sqlite", "postgres", "mysql"].includes(rawClient)
    ? rawClient
    : "sqlite") as Client;

  const connections = {
    mysql: {
      connection: {
        host: env("DATABASE_HOST", "127.0.0.1"),
        port: env.int("DATABASE_PORT", 3306),
        database: env("DATABASE_NAME", "strapi"),
        user: env("DATABASE_USERNAME", "strapi"),
        password: env("DATABASE_PASSWORD", "strapi"),
        ssl:
          env.bool("DATABASE_SSL", false) && {
            key: env("DATABASE_SSL_KEY", undefined),
            cert: env("DATABASE_SSL_CERT", undefined),
            ca: env("DATABASE_SSL_CA", undefined),
            capath: env("DATABASE_SSL_CAPATH", undefined),
            cipher: env("DATABASE_SSL_CIPHER", undefined),
            rejectUnauthorized: env.bool(
              "DATABASE_SSL_REJECT_UNAUTHORIZED",
              true
            ),
          },
      },
      pool: {
        min: env.int("DATABASE_POOL_MIN", 0),
        max: env.int("DATABASE_POOL_MAX", 10),
      },
    },

    postgres: {
      connection: {
        host: env("DATABASE_HOST", "127.0.0.1"),
        port: env.int("DATABASE_PORT", 5432),
        database: env("DATABASE_NAME", "strapi"),
        user: env("DATABASE_USERNAME", "strapi"),
        password: env("DATABASE_PASSWORD", "strapi"),
        schema: env("DATABASE_SCHEMA", "public"),
        ssl:
          env.bool("DATABASE_SSL", false) && {
            key: env("DATABASE_SSL_KEY", undefined),
            cert: env("DATABASE_SSL_CERT", undefined),
            ca: env("DATABASE_SSL_CA", undefined),
            capath: env("DATABASE_SSL_CAPATH", undefined),
            cipher: env("DATABASE_SSL_CIPHER", undefined),
            rejectUnauthorized: env.bool(
              "DATABASE_SSL_REJECT_UNAUTHORIZED",
              true
            ),
          },
      },
      pool: {
        min: env.int("DATABASE_POOL_MIN", 0),
        max: env.int("DATABASE_POOL_MAX", 10),
      },
    },

    sqlite: {
      connection: {
        filename: path.join(
          __dirname,
          "..",
          "..",
          env("DATABASE_FILENAME", ".tmp/data.db")
        ),
      },
      useNullAsDefault: true,
    },
  } as const;

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int("DATABASE_CONNECTION_TIMEOUT", 60000),
    },
  };
};