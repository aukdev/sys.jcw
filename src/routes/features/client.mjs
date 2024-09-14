import { Router } from "express";
import { HTTPSTATUS, HTTPSTATUS_MSG } from "../../const/http-server-config.mjs";
import { clientResponse, RESPONSE } from "../../dto/response.mjs";
import {
  checkPhone,
  checkUsername,
  create,
  getAllCustomers,
  getAllStaff,
  getById,
  searchByPhone,
  update,
} from "../../controller/features/client.mjs";

const clientRouter = Router();

// get all customers
clientRouter.get("/get-all-customers", async (c, w) => {
  const data = await getAllCustomers(c.query.page, c.query.size);
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

// get all staff
clientRouter.get("/get-all-staff", async (c, w) => {
  const data = await getAllStaff(c.query.page, c.query.size);
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
clientRouter.get("/get-by-id/:id", async (c, w) => {
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

// create
clientRouter.post("/", async (c, w) => {
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

// search by phone
clientRouter.post("/search-by-phone", async (c, w) => {
  const data = await searchByPhone(c.body.Phone);
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

// check username
clientRouter.post("/check-username", async (c, w) => {
  const data = await checkUsername(c.body.Username);
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
  } else if (data === "data") {
    w.status(HTTPSTATUS.BAD_REQUEST).json(
      clientResponse(
        RESPONSE.ERROR,
        HTTPSTATUS.BAD_REQUEST,
        undefined,
        "username is already exist."
      )
    );
    return;
  } else if (data === "ok") {
    w.status(HTTPSTATUS.OK).json(
      clientResponse(
        RESPONSE.SUCCESS,
        HTTPSTATUS.OK,
        `you can use ${c.body.Username} for this user`,
        undefined
      )
    );
    return;
  }
});

// check phone
clientRouter.post("/check-phone", async (c, w) => {
  const data = await checkPhone(c.body.phone);
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
  } else if (data === "data") {
    w.status(HTTPSTATUS.BAD_REQUEST).json(
      clientResponse(
        RESPONSE.ERROR,
        HTTPSTATUS.BAD_REQUEST,
        undefined,
        "phone is already exist."
      )
    );
    return;
  } else if (data === "ok") {
    w.status(HTTPSTATUS.OK).json(
      clientResponse(
        RESPONSE.SUCCESS,
        HTTPSTATUS.OK,
        `you can use ${c.body.phone} for this user`,
        undefined
      )
    );
    return;
  }
});

// update
clientRouter.put("/:id", async (c, w) => {
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

export default clientRouter;
