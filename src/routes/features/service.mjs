import { Router } from "express";
import { HTTPSTATUS } from "../../const/http-server-config.mjs";

const serviceRouter = Router();

// router check
serviceRouter.get("/", (_, w) => w.sendStatus(HTTPSTATUS.OK));

export default serviceRouter;
