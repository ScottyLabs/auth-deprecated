import { createAuthClient } from "better-auth/react";
import env from "@/env";

// https://www.better-auth.com/docs/installation#create-client-instance
const auth = createAuthClient({
  baseURL: env.VITE_SERVER_URL,
});

export const signIn = () => {
  auth.signIn
    .social({
      provider: "keycloak",
      callbackURL: window.location.href,
    })
    .then((result) => {
      if (result.error) {
        console.error(result.error);
      }
    });
};

export const signOut = () => {
  auth.signOut().then((result) => {
    if (result.error) {
      console.error(result.error);
    }
  });
};

export const useSession = auth.useSession;
