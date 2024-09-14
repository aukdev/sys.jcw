import DB from "../../db/db.mjs";

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

  // console.log(startOfMonth, " ", endOfMonth);

  try {
    const data = await DB.multiBooking.findMany({
      skip: offset,
      take: Number(size),
      orderBy: {
        id: "desc",
      },
      include: {
        Client: {
          select: { Name: true },
        },
        Booking: {
          where: {
            BookingStatus: {
              not: "cancel",
            },
          },
        },
      },
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const count = await DB.multiBooking.count({
      where: {
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

// get by id
export const getById = async (id) => {
  try {
    const data = await DB.multiBooking.findUnique({
      where: { id: Number(id) },
      include: {
        Client: {
          select: { Name: true, Phone: true, id: true },
        },
      },
    });

    return data;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// create
export const create = async (data) => {
  try {
    const newData = await DB.multiBooking.create({
      data,
    });
    return `booking created with id ${newData.id}`;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// update
export const update = async (id, data) => {
  try {
    const updateData = await DB.multiBooking.update({
      where: { id: Number(id) },
      data,
    });
    return `${updateData.id} booking is updated`;
  } catch (error) {
    console.log(error);
    return "error";
  }
};
