import "dotenv/config";
import server from "express";
import cors from "cors";
import { log } from "node:console";
import { join } from "node:path";
import {
  HTTPSTATUS,
  HTTPSTATUS_MSG,
  PORT,
} from "./src/const/http-server-config.mjs";
import router from "./src/routes/index.mjs";
import { clientResponse, RESPONSE } from "./src/dto/response.mjs";

export const __dirname = import.meta.dirname;
export const __filename = import.meta.filename;

const httpServer = server();

httpServer.use(cors({}));
httpServer.use(server.json());
httpServer.use("/api/v1/", router);
httpServer.use("/data/", server.static(join(__dirname, "src", "public")));
httpServer.use("/*", (_, w) =>
  w
    .status(HTTPSTATUS.NOT_FOUND)
    .json(
      clientResponse(
        RESPONSE.ERROR,
        HTTPSTATUS.NOT_FOUND,
        undefined,
        HTTPSTATUS_MSG.NOT_FOUND
      )
    )
);

httpServer.listen(PORT, () => log(`server running on port ${PORT}`));
