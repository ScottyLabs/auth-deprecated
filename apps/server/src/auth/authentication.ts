// https://tsoa-community.github.io/docs/authentication.html#authentication
// https://medium.com/@alexandre.penombre/tsoa-the-library-that-will-supercharge-your-apis-c551c8989081
import type * as express from "express";
import { AuthenticationError } from "../middleware/errorHandler";

export const OIDC_AUTH = "oidc";
export const ADMIN_SCOPE = "graph-admins";

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[],
) {
  return new Promise((resolve, reject) => {
    if (securityName !== OIDC_AUTH) {
      return reject(new AuthenticationError("Invalid security name"));
    }

    if (!request.user) {
      return reject(new AuthenticationError("User not authenticated"));
    }

    // Check if the token contains the required scopes
    for (const scope of scopes ?? []) {
      if (!request.user.groups?.includes(scope)) {
        return reject(
          new AuthenticationError("JWT does not contain required scope."),
        );
      }
    }

    return resolve({ ...request.user });
  });
}
