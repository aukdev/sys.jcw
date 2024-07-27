import { Router } from "express";
import { HTTPSTATUS } from "../../const/http-server-config.mjs";
import serviceTypeRouter from "./service-type.mjs";
import serviceRouter from "./service.mjs";
import invoiceRouter from "./invoice.mjs";

const featuresRouter = Router();

// router checker
featuresRouter.get("/", (_, w) => w.sendStatus(HTTPSTATUS.OK));

// middleware join
featuresRouter.use("/service-type", serviceTypeRouter);
featuresRouter.use("/service", serviceRouter);
featuresRouter.use("/invoice", invoiceRouter);

export default featuresRouter;
