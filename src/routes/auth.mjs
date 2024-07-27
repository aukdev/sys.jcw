import { Router } from "express";
import { HTTPSTATUS } from "../const/http-server-config.mjs";

const authRouter = Router();

// auth router check
authRouter.get("/", (_, w) => w.sendStatus(HTTPSTATUS.OK));

export default authRouter;
