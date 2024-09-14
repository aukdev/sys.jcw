import { Router } from "express";
import { HTTPSTATUS } from "../const/http-server-config.mjs";
import authRouter from "./auth.mjs";
import featuresRouter from "./features/index.mjs";

const rootRouter = Router();

// server check
rootRouter.get("/", (_, w) => w.sendStatus(HTTPSTATUS.OK));

// join routes
rootRouter.use("/auth", authRouter);
rootRouter.use("/features", featuresRouter);

export default rootRouter;
