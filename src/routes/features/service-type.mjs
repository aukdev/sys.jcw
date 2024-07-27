import { Router } from "express";
import { HTTPSTATUS } from "../../const/http-server-config.mjs";

const serviceTypeRouter = Router();

// router checker
serviceTypeRouter.get("/", (_, w) => w.sendStatus(HTTPSTATUS.OK));

export default serviceTypeRouter;
