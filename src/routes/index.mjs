import { Router } from "express";
import { HTTPSTATUS } from "../const/http-server-config.mjs";
import authRouter from "./auth.mjs";
import bookingRouter from "./booking.mjs";
import featuresRouter from "./features/index.mjs";
import clientRouter from "./client.mjs";

const rootRouter = Router();

// server check
rootRouter.get("/", (_, w) => w.sendStatus(HTTPSTATUS.OK));

// join routes
rootRouter.use("/auth", authRouter);
rootRouter.use("/booking", bookingRouter);
rootRouter.use("/features", featuresRouter);
rootRouter.use("/client", clientRouter);

export default rootRouter;
