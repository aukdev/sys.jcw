import { Router } from "express";
import { HTTPSTATUS, HTTPSTATUS_MSG } from "../const/http-server-config.mjs";
import { login } from "../controller/auth.mjs";
import { clientResponse, RESPONSE } from "../dto/response.mjs";

const authRouter = Router();

// auth router check
authRouter.post("/login", async (c, w) => {
  const data = await login(c.body.username, c.body.password);
  if (data === "error") {
    w.status(HTTPSTATUS_MSG.SERVER_ERROR).json(
      clientResponse(
        RESPONSE.ERROR,
        HTTPSTATUS.SERVER_ERROR,
        undefined,
        HTTPSTATUS_MSG.SERVER_ERROR
      )
    );
    return;
  }
  w.status(HTTPSTATUS.OK).json(
    clientResponse(RESPONSE.SUCCESS, HTTPSTATUS.OK, data, undefined)
  );
});

export default authRouter;
