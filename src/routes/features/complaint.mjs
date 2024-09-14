import { Router } from "express";
import { HTTPSTATUS, HTTPSTATUS_MSG } from "../../const/http-server-config.mjs";
import { clientResponse, RESPONSE } from "../../dto/response.mjs";
import {
  create,
  deleteData,
  getAll,
  getById,
  getForCustomer,
  update,
} from "../../controller/features/complaint.mjs";
import upload from "../../middleware/file-upload.mjs";

const complaintRoute = Router();

// get all
complaintRoute.get("/all", async (c, w) => {
  const data = await getAll(c.query.page, c.query.size);
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

// get by id
complaintRoute.get("/:id", async (c, w) => {
  const data = await getById(c.params.id);
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
// get for client
complaintRoute.get("/customer/:clientId", async (c, w) => {
  const data = await getForCustomer(c.params.clientId);
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
complaintRoute.post("/", async (c, w) => {
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
complaintRoute.put("/:id", async (c, w) => {
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

// complaint image
complaintRoute.post("/complaint-image", (c, w) => {
  upload.single("complaint-image")(c, w, (err) => {
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
complaintRoute.delete("/:id", async (c, w) => {
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

export default complaintRoute;
