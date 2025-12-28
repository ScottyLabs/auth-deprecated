// https://tsoa-community.github.io/docs/authentication.html#authentication
// https://medium.com/@alexandre.penombre/tsoa-the-library-that-will-supercharge-your-apis-c551c8989081
import type * as express from "express";

export const OIDC_AUTH = "oidc";
export const ADMIN_SCOPE = "graph-admins";

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[],
) {
  return new Promise((resolve, reject) => {
    const response = request.res;
    if (securityName !== OIDC_AUTH) {
      response?.status(401).json({ message: "Invalid security name" });
      return reject({});
    }

    if (!request.user) {
      return reject({});
    }

    // Check if the token contains the required scopes
    for (const scope of scopes ?? []) {
      if (!request.user.groups?.includes(scope)) {
        response
          ?.status(401)
          .json({ message: "JWT does not contain required scope." });
        return;
      }
    }

    return resolve({ ...request.user });
  });
}
