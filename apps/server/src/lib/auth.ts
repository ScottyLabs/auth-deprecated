import { betterAuth } from "better-auth";
import { genericOAuth, keycloak } from "better-auth/plugins";
import env from "../env";

export const auth = betterAuth({
  baseURL: env.SERVER_URL,
  trustedOrigins: [env.BETTER_AUTH_URL],

  // https://www.better-auth.com/docs/plugins/generic-oauth#pre-configured-provider-helpers
  plugins: [
    genericOAuth({
      config: [
        keycloak({
          clientId: env.AUTH_CLIENT_ID,
          clientSecret: env.AUTH_CLIENT_SECRET,
          issuer: env.AUTH_ISSUER,
          redirectURI: `${env.SERVER_URL}/api/auth/oauth2/callback/keycloak`,
          scopes: ["openid", "email", "profile", "offline_access"],
        }),
      ],
    }),
  ],
});
