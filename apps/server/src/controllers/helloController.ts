import type { Request as ExpressRequest } from "express";
import { Get, Request, Route, Security } from "tsoa";
import { ADMIN_SCOPE } from "../middleware/authentication";
import { helloService } from "../services/helloService";

@Security("oidc")
@Route("hello")
export class HelloController {
  @Get("/")
  async getHello(@Request() req: ExpressRequest) {
    console.log(req.user);
    return helloService.hello(req.user as Express.User);
  }

  @Security("oidc", [ADMIN_SCOPE])
  @Get("/authenticated")
  async getAuthenticated(@Request() req: ExpressRequest) {
    return helloService.helloAuthenticated(req.user as Express.User);
  }
}
