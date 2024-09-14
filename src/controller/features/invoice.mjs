import DB from "../../db/db.mjs";
import { join } from "node:path";
import { readFileSync, writeFileSync } from "node:fs";
import { PDFDocument, rgb } from "pdf-lib";
import { __dirname } from "../../../server.mjs";

// get All of this month
export const getAllMonthly = async (page, size) => {
  const offset = (Number(page) - 1) * Number(size);
  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );
  const endOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  try {
    const data = await DB.invoice.findMany({
      skip: offset,
      take: Number(size),
      orderBy: {
        id: "desc",
      },
      include: {
        Client: {
          select: {
            Name: true,
          },
        },
      },
      where: {
        StartingPoint: false,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const count = await DB.invoice.count({
      where: {
        StartingPoint: false,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    return { data, count, page, pageSize: size };
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// get All by date
export const getAllByDate = async (date, page, size) => {
  const offset = (Number(page) - 1) * Number(size);
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const data = await DB.invoice.findMany({
      skip: offset,
      take: Number(size),
      orderBy: {
        id: "desc",
      },
      include: {
        Client: {
          select: {
            Name: true,
          },
        },
      },
      where: {
        StartingPoint: false,
        Date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const count = await DB.invoice.count({
      where: {
        StartingPoint: false,
        Date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return { data, count, page, pageSize: size };
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// get invoice by id
export const getById = async (id) => {
  try {
    // get last invoice Id
    const lastInvoice = await DB.invoice.findFirst({
      orderBy: { invoiceId: "desc" },
      select: { invoiceId: true },
      where: {
        PaymentStatus: "success",
        invoiceId: {
          not: null,
        },
      },
    });

    const data = await DB.invoice.findUnique({
      where: { id: Number(id) },
      include: {
        Booking: {
          select: {
            Contact: true,
            ServiceType: true,
            ServiceDetails: true,
            Date: true,
          },
        },
        Client: {
          select: {
            Name: true,
          },
        },
      },
    });

    if (data.invoiceId === null) data.invoiceId = lastInvoice.invoiceId + 1;
    // console.log(lastInvoice.invoiceId);

    const { Booking, Client, ...rest } = data;
    return {
      ...rest,
      BookingDate: data.Booking.Date,
      CustomerName: data.Client.Name,
      CustomerPhone: data.Booking.Contact,
      InvoiceType: data.Booking.ServiceType,
      InvoiceDetails: data.Booking.ServiceDetails,
    };
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// get by multi booking id
export const getByMultiBookingId = async (multiBookingId) => {
  try {
    const data = await DB.invoice.findMany({
      where: {
        MultiBookingId: Number(multiBookingId),
      },
    });

    return data;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// check invoice number
export const checkInvoiceNumber = async (invoiceId) => {
  try {
    const count = await DB.invoice.count({
      where: {
        invoiceId: Number(invoiceId),
      },
    });
    if (count) return "data";
    else return "ok";
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// create new invoice
export const create = async (data) => {
  try {
    // // get last invoice Id
    // const lastInvoice = await DB.invoice.findFirst({ orderBy: { id: "desc" } });

    // create new invoice
    const newData = await DB.invoice.create({
      data: {
        // invoiceId: lastInvoice.invoiceId + 1,
        ...data,
      },
    });

    await DB.booking.update({
      where: { id: newData.BookId },
      data: {
        BookingStatus: "on-proccess",
      },
    });
    return newData.id;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// starting invoice create
export const startingInvoiceCreate = async (data) => {
  try {
    const newData = await DB.invoice.create({
      data,
    });
    return `starting invoice created id start by: ${newData.invoiceId}`;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// update invoice
export const update = async (id, data) => {
  try {
    const { InvoiceDate, ...restData } = data;
    const updateData = await DB.invoice.update({
      where: {
        id: Number(id),
      },
      data: restData,
    });
    return `invoice updated id: ${updateData.id}`;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

export const mainPDFCreate = async (data) => {
  const file = `${data.file}`.split("/");
  try {
    const sendData = DB.mainPDF.create({
      data: { File: file[file.length - 1] },
    });
    return sendData;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// mainpdf update
export const mainPDFUpdate = async (data) => {
  const file = `${data.file}`.split("/");
  try {
    const preData = await DB.mainPDF.findFirst({ orderBy: { id: "desc" } });
    const updataData = await DB.mainPDF.update({
      where: { id: preData.id },
      data: {
        File: file[file.length - 1],
      },
    });
    return updataData;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// complet job
export const completeJob = async (id) => {
  try {
    await DB.booking.update({
      where: { id: Number(id) },
      data: {
        BookingStatus: "completed",
      },
    });
    return "job completed";
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// invoice generate
export const invoiceGen = async (id) => {
  try {
    // get last invoice Id
    const lastInvoice = await DB.invoice.findFirst({
      orderBy: { invoiceId: "desc" },
      select: { invoiceId: true, id: true },
      where: {
        PaymentStatus: "success",
        invoiceId: {
          not: null,
        },
      },
    });

    const d = await DB.invoice.findUnique({ where: { id: Number(id) } });

    if (d.invoiceId === null) {
      // update invoice
      await DB.invoice.update({
        where: { id: Number(id) },
        data: { invoiceId: lastInvoice.invoiceId + 1 },
      });
    }

    // get data
    const data = await DB.invoice.findUnique({
      where: { id: Number(id) },
      include: {
        Booking: {
          select: {
            Contact: true,
            ServiceType: true,
            ServiceDetails: true,
          },
        },
        Client: {
          select: { Name: true },
        },
      },
    });

    await DB.booking.update({
      where: { id: data.BookId },
      data: {
        BookingStatus: "completed",
      },
    });
    // get main pdf
    const dbMainPDFData = await DB.mainPDF.findFirst({
      orderBy: { id: "desc" },
    });
    // console.log(dbMainPDFData);
    // read file
    const pdfBytes = readFileSync(
      join(__dirname, "src", "public", dbMainPDFData.File)
    );
    // pdf doc load
    const pdfDoc = await PDFDocument.load(pdfBytes);
    // get pdf pages
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    let startYoffSet = 182;

    const input1 = [
      data.Client.Name,
      data.Booking.Contact,
      `${data.Date}`.split("+")[0],
      data.BookId.toString(),
      data.invoiceId.toString(),
      data.Booking.ServiceType,
    ];

    const input2 = [
      data.StartTime,
      data.EndTime,
      data.NumberOfCars.toString(),
      data?.VehicalNoPlates ? data.VehicalNoPlates : "",
      data.PaymentMethod,
      Number(data.InvoiceAmount).toLocaleString("en-US", {
        style: "currency",
        currency: "QAR",
      }),
      data.Booking.ServiceDetails,
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

    // if have remaks then write it to doc
    if (data.Remarks) {
      const formatText = data.Remarks;

      let aaa = 0;
      let remarkStart = 415;

      while (aaa < formatText.length) {
        const writeText = formatText.substring(aaa, aaa + 90);
        aaa += 90;
        // add remark
        firstPage.drawText(writeText, {
          x: 75,
          y: remarkStart,
          size: 10,
          color: rgb(0, 0, 0),
        });
        remarkStart -= 13;
      }
    }

    // print customer signature
    const cusSign = `${data.CustomerSignature}`.split("/");
    const imageBytes = readFileSync(
      join(__dirname, "src", "public", cusSign[cusSign.length - 1])
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
    if (
      data.IssureImage1 ||
      data.IssureImage2 ||
      data.IssureImage3 ||
      data.IssureImage4 ||
      data.IssureImage5 ||
      data.IssureImage6
    ) {
      const newPage = pdfDoc.addPage();
      let newPageHeight = newPage.getHeight();

      // image 1
      if (data.IssureImage1) {
        const issImg = `${data.IssureImage1}`.split("/");
        const issureImageBytes = readFileSync(
          join(__dirname, "src", "public", issImg[issImg.length - 1])
        );
        const jpgImage = await pdfDoc.embedJpg(issureImageBytes);
        newPage.drawImage(jpgImage, {
          x: 50,
          y: newPageHeight - 200,
          width: 208,
          height: 156,
        });
      }

      // image 2
      if (data.IssureImage2) {
        const issImg = `${data.IssureImage2}`.split("/");
        const issureImageBytes = readFileSync(
          join(__dirname, "src", "public", issImg[issImg.length - 1])
        );
        const jpgImage = await pdfDoc.embedJpg(issureImageBytes);
        newPage.drawImage(jpgImage, {
          x: 270,
          y: newPageHeight - 200,
          width: 208,
          height: 156,
        });
      }

      // image 3
      if (data.IssureImage3) {
        const issImg = `${data.IssureImage3}`.split("/");
        const issureImageBytes = readFileSync(
          join(__dirname, "src", "public", issImg[issImg.length - 1])
        );
        const jpgImage = await pdfDoc.embedJpg(issureImageBytes);
        newPage.drawImage(jpgImage, {
          x: 50,
          y: newPageHeight - 370,
          width: 208,
          height: 156,
        });
      }

      // image 4
      if (data.IssureImage4) {
        const issImg = `${data.IssureImage4}`.split("/");
        const issureImageBytes = readFileSync(
          join(__dirname, "src", "public", issImg[issImg.length - 1])
        );
        const jpgImage = await pdfDoc.embedJpg(issureImageBytes);
        newPage.drawImage(jpgImage, {
          x: 270,
          y: newPageHeight - 370,
          width: 208,
          height: 156,
        });
      }

      // image 5
      if (data.IssureImage5) {
        const issImg = `${data.IssureImage5}`.split("/");
        const issureImageBytes = readFileSync(
          join(__dirname, "src", "public", issImg[issImg.length - 1])
        );
        const jpgImage = await pdfDoc.embedJpg(issureImageBytes);
        newPage.drawImage(jpgImage, {
          x: 50,
          y: newPageHeight - 540,
          width: 208,
          height: 156,
        });
      }

      // image 6
      if (data.IssureImage6) {
        const issImg = `${data.IssureImage6}`.split("/");
        const issureImageBytes = readFileSync(
          join(__dirname, "src", "public", issImg[issImg.length - 1])
        );
        const jpgImage = await pdfDoc.embedJpg(issureImageBytes);
        newPage.drawImage(jpgImage, {
          x: 270,
          y: newPageHeight - 540,
          width: 208,
          height: 156,
        });
      }
    }

    // Serialize the PDFDocument to bytes
    const outPdfBytes = await pdfDoc.save();

    const filename = Date.now();
    // console.log(filename);
    // Write the PDF to a file
    writeFileSync(
      join(__dirname, "src", "public", `${filename}_invoice.pdf`),
      outPdfBytes
    );

    // update generated invoice to db
    await DB.invoice.update({
      where: { id: data.id },
      data: { InvoicePDF: `/data/${filename}_invoice.pdf` },
    });

    return { file: `/data/${filename}_invoice.pdf` };
  } catch (error) {
    console.log(error);
    return "error";
  }
};
