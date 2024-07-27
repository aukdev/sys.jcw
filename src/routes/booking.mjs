import { Router } from "express";
import { HTTPSTATUS } from "../const/http-server-config.mjs";

const bookingRouter = Router();

// booking router check
bookingRouter.get("/", (_, w) => w.sendStatus(HTTPSTATUS.OK));

export default bookingRouter;
