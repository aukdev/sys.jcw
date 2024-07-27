import { Router } from "express";
import { HTTPSTATUS, HTTPSTATUS_MSG } from "../../const/http-server-config.mjs";
import { clientResponse, RESPONSE } from "../../dto/response.mjs";
import { __dirname } from "../../../server.mjs";
import { join } from "node:path";
import { readFileSync, writeFileSync } from "node:fs";
import { PDFDocument, rgb } from "pdf-lib";
import upload from "../../middleware/file-upload.mjs";

const invoiceRouter = Router();

invoiceRouter.get("/", async (_, w) => {
  try {
    // read file
    const pdfBytes = readFileSync(join(__dirname, "src", "public", "pdf2.pdf"));
    // pdf doc load
    const pdfDoc = await PDFDocument.load(pdfBytes);
    // get pdf pages
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    let startYoffSet = 182;

    const input1 = [
      "Abdulla Al Hakim",
      "2222333",
      "25/07/2024",
      "2323",
      "23232",
      "Invoice Type",
    ];

    const input2 = [
      "11:00AM",
      "02:00PM",
      "2",
      "233223",
      "Bank Transfer",
      Number(12000).toLocaleString("en-US", {
        style: "currency",
        currency: "QAR",
      }),
      "Invoice Details",
    ];

    input1.forEach((d) => {
      // Add the text to the page
      firstPage.drawText(d, {
        x: 175, // X-coordinate
        y: firstPage.getHeight() - startYoffSet, // Y-coordinate
        size: 12, // Font size
        color: rgb(0, 0, 0), // Text color
      });
      startYoffSet += 15;
    });

    // second input
    startYoffSet += 22;
    input2.forEach((d, i) => {
      firstPage.drawText(d, {
        x: 175, // X-coordinate
        y: firstPage.getHeight() - startYoffSet, // Y-coordinate
        size: 11, // Font size
        color: rgb(0, 0, 0), // Text color
      });
      startYoffSet += 15;
      if (i < 3) startYoffSet -= i;
      else startYoffSet -= 1;
    });

    const newPage = pdfDoc.addPage();
    // console.log(newPage.getHeight());

    const imageBytes = readFileSync(
      join(__dirname, "src", "public", "1722008205458_signature.png")
    );
    const pngImage = await pdfDoc.embedPng(imageBytes);

    // Get the image dimensions
    const pngDims = pngImage.scale(0.5); // Adjust the scale as needed

    // Add the image to the page
    firstPage.drawImage(pngImage, {
      x: 350, // X-coordinate
      y: 230, // Y-coordinate
      width: pngDims.width,
      height: pngDims.height,
    });

    // new page images
    let newPageHeight = newPage.getHeight();
    console.log(newPage.getWidth());
    const issureImageBytes = readFileSync(
      join(__dirname, "src", "public", "1722008250366_vehical-issure.jpeg")
    );
    const jpgImage1 = await pdfDoc.embedJpg(issureImageBytes);
    newPage.drawImage(jpgImage1, {
      x: 50,
      y: newPageHeight - 200,
      width: 208,
      height: 156,
    });

    // image 2
    newPage.drawImage(jpgImage1, {
      x: 270,
      y: newPageHeight - 200,
      width: 208,
      height: 156,
    });

    // image 3
    newPage.drawImage(jpgImage1, {
      x: 50,
      y: newPageHeight - 370,
      width: 208,
      height: 156,
    });

    // image 4
    newPage.drawImage(jpgImage1, {
      x: 270,
      y: newPageHeight - 370,
      width: 208,
      height: 156,
    });

    // image 5
    newPage.drawImage(jpgImage1, {
      x: 50,
      y: newPageHeight - 540,
      width: 208,
      height: 156,
    });

    // image 6
    newPage.drawImage(jpgImage1, {
      x: 270,
      y: newPageHeight - 540,
      width: 208,
      height: 156,
    });

    // Serialize the PDFDocument to bytes
    const outPdfBytes = await pdfDoc.save();

    const filename = Date.now();
    // console.log(filename);
    // Write the PDF to a file
    writeFileSync(
      join(__dirname, "src", "public", `${filename}_invoice.pdf`),
      outPdfBytes
    );
    w.status(HTTPSTATUS.CREATED).json(
      clientResponse(
        RESPONSE.SUCCESS,
        HTTPSTATUS.CREATED,
        { file: `/data/${filename}_invoice.pdf` },
        undefined
      )
    );
    // console.log(join(__dirname, "src", "public", "pdf2.pdf"));
  } catch (error) {
    console.log(error);
    w.status(HTTPSTATUS.SERVER_ERROR).json(
      clientResponse(
        RESPONSE.ERROR,
        HTTPSTATUS.SERVER_ERROR,
        undefined,
        HTTPSTATUS_MSG.SERVER_ERROR
      )
    );
  }
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
