import type { Request as ExpressRequest } from "express";
import { Get, Request, Route, Security } from "tsoa";
import { ADMIN_SCOPE, BEARER_AUTH, OIDC_AUTH } from "../auth/authentication";
import { helloService } from "../services/helloService";

@Security(OIDC_AUTH)
@Security(BEARER_AUTH)
@Route("hello")
export class HelloController {
  @Get("/")
  async getHello(@Request() req: ExpressRequest) {
    return helloService.hello(req.user as Express.User);
  }

  @Security(OIDC_AUTH, [ADMIN_SCOPE])
  @Security(BEARER_AUTH, [ADMIN_SCOPE])
  @Get("/authenticated")
  async getAuthenticated(@Request() req: ExpressRequest) {
    return helloService.helloAuthenticated(req.user as Express.User);
  }
}
