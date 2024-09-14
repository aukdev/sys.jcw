import { Router } from "express";
import upload from "../../middleware/file-upload.mjs";
import { HTTPSTATUS, HTTPSTATUS_MSG } from "../../const/http-server-config.mjs";
import { clientResponse, RESPONSE } from "../../dto/response.mjs";
import {
  create,
  deleteData,
  getAll,
  update,
} from "../../controller/features/ads.mjs";

const adsRoute = Router();

// get all
adsRoute.get("/", async (_, w) => {
  const data = await getAll();
  if (data === "error") {
    w.status(HTTPSTATUS.SERVER_ERROR).json(
      clientResponse(
        RESPONSE.ERROR,
        HTTPSTATUS.SERVER_ERROR,
        undefined,
        HTTPSTATUS_MSG.SERVER_ERROR
      )
    );
    return;
  }
  w.status(HTTPSTATUS.OK).json(
    clientResponse(RESPONSE.SUCCESS, HTTPSTATUS.OK, data, undefined)
  );
});

// create
adsRoute.post("/", async (c, w) => {
  const data = await create(c.body);
  if (data === "error") {
    w.status(HTTPSTATUS.SERVER_ERROR).json(
      clientResponse(
        RESPONSE.ERROR,
        HTTPSTATUS.SERVER_ERROR,
        undefined,
        HTTPSTATUS_MSG.SERVER_ERROR
      )
    );
    return;
  }
  w.status(HTTPSTATUS.CREATED).json(
    clientResponse(RESPONSE.SUCCESS, HTTPSTATUS.CREATED, data, undefined)
  );
});

// update
adsRoute.put("/:id", async (c, w) => {
  const data = await update(c.params.id, c.body);
  if (data === "error") {
    w.status(HTTPSTATUS.SERVER_ERROR).json(
      clientResponse(
        RESPONSE.ERROR,
        HTTPSTATUS.SERVER_ERROR,
        undefined,
        HTTPSTATUS_MSG.SERVER_ERROR
      )
    );
    return;
  }
  w.status(HTTPSTATUS.OK).json(
    clientResponse(RESPONSE.SUCCESS, HTTPSTATUS.OK, data, undefined)
  );
});

// ads image
adsRoute.post("/ads-image", (c, w) => {
  upload.single("ads-image")(c, w, (err) => {
    if (err)
      w.status(HTTPSTATUS_MSG.SERVER_ERROR).json(
        clientResponse(
          RESPONSE.ERROR,
          HTTPSTATUS.SERVER_ERROR,
          undefined,
          HTTPSTATUS_MSG.SERVER_ERROR
        )
      );
    w.status(HTTPSTATUS.CREATED).json(
      clientResponse(
        RESPONSE.SUCCESS,
        HTTPSTATUS.CREATED,
        { file: `/data/${c.file.filename}` },
        undefined
      )
    );
  });
});

// delete
adsRoute.delete("/:id", async (c, w) => {
  const data = await deleteData(c.params.id);
  if (data === "error") {
    w.status(HTTPSTATUS.SERVER_ERROR).json(
      clientResponse(
        RESPONSE.ERROR,
        HTTPSTATUS.SERVER_ERROR,
        undefined,
        HTTPSTATUS_MSG.SERVER_ERROR
      )
    );
    return;
  }
  w.status(HTTPSTATUS.OK).json(
    clientResponse(RESPONSE.SUCCESS, HTTPSTATUS.OK, data, undefined)
  );
});

export default adsRoute;
