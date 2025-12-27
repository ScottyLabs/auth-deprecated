import fs from "node:fs";
import http from "node:http";
import { YAML } from "bun";
import cookieParser from "cookie-parser";
import cors, { type CorsOptions } from "cors";
import type { ErrorRequestHandler } from "express";
import express from "express";
import session from "express-session";
import * as client from "openid-client";
import {
  Strategy,
  type StrategyOptions,
  type VerifyFunction,
} from "openid-client/passport";
import passport, { type AuthenticateOptions } from "passport";
import swaggerUi, { type JsonObject } from "swagger-ui-express";
import { RegisterRoutes } from "../build/routes";
import env from "./env";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFoundHandler";

const app = express();

// Define CORS options
const corsOptions: CorsOptions = {
  origin: env.ALLOWED_ORIGINS_REGEX?.split(",").map(
    (origin) => new RegExp(origin),
  ),
  credentials: true,
};
app.use(cors(corsOptions));

// Create HTTP server with Express app attached
const server = http.createServer(app);

// Swagger
const file = fs.readFileSync("./build/swagger.yaml", "utf8");
const swaggerDocument = YAML.parse(file) as JsonObject;
app.use("/swagger", express.static("./node_modules/swagger-ui-dist"));
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Authentication Setup: https://github.com/panva/openid-client/blob/HEAD/examples/passport.ts
declare global {
  namespace Express {
    interface User {
      sub: string;
      email?: string;
      given_name?: string;
      groups?: string[];
    }
  }
}

declare module "express-session" {
  interface SessionData {
    returnTo?: string;
  }
}

const config = await client.discovery(
  new URL(env.AUTH_ISSUER),
  env.AUTH_CLIENT_ID,
  env.AUTH_CLIENT_SECRET,
);

app.use(cookieParser());
app.use(
  session({
    saveUninitialized: false,
    resave: true,
    secret: env.AUTH_SESSION_SECRET,
  }),
);
app.use(passport.authenticate("session"));

const verify: VerifyFunction = (tokens, verified) => {
  verified(null, tokens.claims());
};

const options: StrategyOptions = {
  config,
  scope: "openid profile email offline_access",
  callbackURL: `${env.SERVER_URL}/auth/callback`,
};

passport.use("openid", new Strategy(options, verify));

passport.serializeUser((user: Express.User, cb) => {
  cb(null, user);
});

passport.deserializeUser((user: Express.User, cb) => {
  return cb(null, user);
});

// Authentication routes
app.get(
  "/login",
  (req, _res, next) => {
    if (req.query["redirect_uri"]) {
      req.session.returnTo = req.query["redirect_uri"] as string;
    }
    next();
  },
  passport.authenticate("openid"),
);

app.get(
  "/auth/callback",
  passport.authenticate("openid", {
    successReturnToOrRedirect: "/",
    keepSessionInfo: true,
  } as AuthenticateOptions),
);

app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(
      client.buildEndSessionUrl(config, {
        post_logout_redirect_uri:
          (req.query["redirect_uri"] as string) ||
          `${req.protocol}://${req.host}`,
      }).href,
    );
  });
});

// Other Routes
RegisterRoutes(app);
app.get("/", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Register error and not found handlers
app.use(errorHandler as ErrorRequestHandler);
app.use(notFoundHandler);

// Start the server
const port = env.SERVER_PORT;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  process.exit();
});
