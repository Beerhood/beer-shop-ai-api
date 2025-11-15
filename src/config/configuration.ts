const configuration = () => ({
  port: Number.parseInt(process.env.PORT ?? '3000', 10) || 3000,
  nodeEnv: process.env.NODE_ENV,
  client: process.env.CLIENT_URL,
  db_srv: process.env.DB_SRV,
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL,
  },
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  },
});

export type AppConfiguration = ReturnType<typeof configuration>;

export default configuration;
