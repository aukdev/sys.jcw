import DB from "../../db/db.mjs";

const AVAILABLE_TIMES_TEAM = [
  "12:00 AM",
  "01:00 AM",
  "02:00 AM",
  "03:00 AM",
  "04:00 AM",
  "05:00 AM",
  "06:00 AM",
  "07:00 AM",
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
  "09:00 PM",
  "10:00 PM",
  "11:00 PM",
];

const AVAILABLE_TIMES_CUSTOMERS = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
  "09:00 PM",
  "10:00 PM",
  "11:00 PM",
];

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
    const data = await DB.booking.findMany({
      skip: offset,
      take: Number(size),
      orderBy: {
        id: "desc",
      },
      include: {
        Client: {
          select: { Name: true },
        },
        Team: {
          select: {
            TeamName: true,
          },
        },
      },
      where: {
        Date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        BookingStatus: {
          not: "cancel",
        },
      },
    });

    const count = await DB.booking.count({
      where: {
        Date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        BookingStatus: {
          not: "cancel",
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

  // console.log(startOfDay, " ", endOfDay);

  try {
    const data = await DB.booking.findMany({
      skip: offset,
      take: +size,
      orderBy: {
        id: "desc",
      },
      include: {
        Client: {
          select: { Name: true },
        },
        Team: {
          select: {
            TeamName: true,
          },
        },
      },
      where: {
        Date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        BookingStatus: {
          not: "cancel",
        },
      },
    });

    const count = await DB.booking.count({
      where: {
        Date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        BookingStatus: {
          not: "cancel",
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
    const data = await DB.booking.findUnique({
      where: { id: Number(id) },
      include: { Client: true },
    });
    return data;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// get by multi booking id
export const getByMultiBookingId = async (multiBookingId) => {
  try {
    const data = await DB.booking.findMany({
      where: {
        MultiBookingId: Number(multiBookingId),
        BookingStatus: {
          not: "cancel",
        },
      },
      include: {
        Client: {
          select: { Name: true },
        },
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// get jobs
export const getJobs = async (date, team) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const data = await DB.booking.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        Client: {
          select: { Name: true },
        },
        Invoice: {
          select: {
            id: true,
          },
        },
      },
      where: {
        Date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        BookingStatus: {
          not: "cancel",
        },
        TeamId: {
          in: team,
        },
      },
    });

    return data;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// available times
export const availableTimesTeam = async (date) => {
  return AVAILABLE_TIMES_TEAM;
};

// available times
export const availableTimesCustomers = async (date) => {
  return AVAILABLE_TIMES_CUSTOMERS;
};

// create
export const create = async (data) => {
  try {
    const { BookingDate, ExpireTime, ...restData } = data;
    const newData = await DB.booking.create({
      data: {
        Date: new Date(BookingDate),
        ExpireTime: ExpireTime ? new Date(ExpireTime) : null,
        ...restData,
      },
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
    const { BookingDate, ...restData } = data;
    const updateData = await DB.booking.update({
      where: { id: Number(id) },
      data: {
        Date: new Date(BookingDate),
        ...restData,
      },
    });
    return `${updateData.id} booking is updated`;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

//   delete
export const deleteData = async (id) => {
  try {
    await DB.booking.delete({ where: { id: Number(id) } });
    return `${id} booking is deleted`;
  } catch (error) {
    console.log(error);
    return "error";
  }
};
