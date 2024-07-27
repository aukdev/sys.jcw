import { Router } from "express";
import { HTTPSTATUS } from "../const/http-server-config.mjs";

const clientRouter = Router();

// router check
clientRouter.get("/", (_, w) => w.sendStatus(HTTPSTATUS.OK));

export default clientRouter;
