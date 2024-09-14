import { Router } from "express";
import { HTTPSTATUS } from "../../const/http-server-config.mjs";
import serviceTypeRouter from "./service-type.mjs";
import serviceRouter from "./service.mjs";
import invoiceRouter from "./invoice.mjs";
import clientRouter from "./client.mjs";
import teamRouter from "./team.mjs";
import productRouter from "./product.mjs";
import orderRoute from "./order.mjs";
import adsRoute from "./ads.mjs";
import advanceRoute from "./advance.mjs";
import bookingRouter from "./booking.mjs";
import complaintRoute from "./complaint.mjs";
import multiBookingRouter from "./multi-booking.mjs";

const featuresRouter = Router();

// router checker
featuresRouter.get("/", (_, w) => w.sendStatus(HTTPSTATUS.OK));

// middleware join
featuresRouter.use("/service-type", serviceTypeRouter);
featuresRouter.use("/service", serviceRouter);
featuresRouter.use("/booking", bookingRouter);
featuresRouter.use("/multi-booking", multiBookingRouter);
featuresRouter.use("/invoice", invoiceRouter);
featuresRouter.use("/client", clientRouter);
featuresRouter.use("/team", teamRouter);
featuresRouter.use("/product", productRouter);
featuresRouter.use("/order", orderRoute);
featuresRouter.use("/ads", adsRoute);
featuresRouter.use("/advance", advanceRoute);
featuresRouter.use("/complaint", complaintRoute);

export default featuresRouter;
