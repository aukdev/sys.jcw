import { Router } from "express";
import { HTTPSTATUS, HTTPSTATUS_MSG } from "../../const/http-server-config.mjs";
import { clientResponse, RESPONSE } from "../../dto/response.mjs";
import { __dirname } from "../../../server.mjs";
import upload from "../../middleware/file-upload.mjs";
import {
  getAllMonthly,
  getAllByDate,
  getById,
  checkInvoiceNumber,
  create,
  mainPDFCreate,
  update,
  mainPDFUpdate,
  invoiceGen,
  startingInvoiceCreate,
  getByMultiBookingId,
  completeJob,
} from "../../controller/features/invoice.mjs";

const invoiceRouter = Router();

//get all monthly invoice
invoiceRouter.get("/get-all-monthly", async (c, w) => {
  const page = c.query.page;
  const size = c.query.size;
  const data = await getAllMonthly(page, size);

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

//get all daylly invoice
invoiceRouter.get("/get-by-date", async (c, w) => {
  const date = c.query.date;
  const page = c.query.page;
  const size = c.query.size;

  const data = await getAllByDate(date, page, size);

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

// get invoice by id
invoiceRouter.get("/:id", async (c, w) => {
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

// get by multi booking id
invoiceRouter.get("/get-by-multibooking/:id", async (c, w) => {
  const data = await getByMultiBookingId(c.params.id);
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

// job complete
invoiceRouter.get("/job-complete/:bookId", async (c, w) => {
  const data = await completeJob(c.params.bookId);
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

// create new invoice
invoiceRouter.post("/", async (c, w) => {
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

// create main pdf
invoiceRouter.post("/main-pdf", async (c, w) => {
  const data = await mainPDFCreate(c.body);
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

// starting invoice created
invoiceRouter.post("/starting-inovice", async (c, w) => {
  const data = await startingInvoiceCreate(c.body);
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

// update main-pdf
invoiceRouter.put("/main-pdf", async (c, w) => {
  const data = await mainPDFUpdate(c.body);
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
// update invoice
invoiceRouter.put("/:id", async (c, w) => {
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

// check invoice number
invoiceRouter.post("/check-invoice-number", async (c, w) => {
  const data = await checkInvoiceNumber(c.body.invoiceId);
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
        "invoice id is already exist."
      )
    );
    return;
  } else if (data === "ok") {
    w.status(HTTPSTATUS.OK).json(
      clientResponse(
        RESPONSE.SUCCESS,
        HTTPSTATUS.OK,
        `you can use ${c.body.invoiceId} as invoice id`,
        undefined
      )
    );
    return;
  }
});

// genarate invoice pdf
invoiceRouter.post("/invoice-pdf", async (c, w) => {
  const data = await invoiceGen(c.body.id);
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

// client signature
invoiceRouter.post("/signature", (c, w) => {
  upload.single("signature")(c, w, (err) => {
    if (err)
      w.status(HTTPSTATUS.SERVER_ERROR).json(
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

// payment slip
invoiceRouter.post("/payment-slip", (c, w) => {
  upload.single("payment-slip")(c, w, (err) => {
    if (err)
      w.status(HTTPSTATUS.SERVER_ERROR).json(
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

// payment slip
invoiceRouter.post("/invoice-pdf-file", (c, w) => {
  upload.single("invoice-pdf-file")(c, w, (err) => {
    if (err)
      w.status(HTTPSTATUS.SERVER_ERROR).json(
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

// vehical issure
invoiceRouter.post("/vehical-issure", (c, w) => {
  upload.single("vehical-issure")(c, w, (err) => {
    if (err)
      w.status(HTTPSTATUS.SERVER_ERROR).json(
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

export default invoiceRouter;
