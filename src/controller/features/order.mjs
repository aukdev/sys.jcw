import DB from "../../db/db.mjs";

// get All of this month
export const getAll = async (page, size) => {
  const offset = (Number(page) - 1) * Number(size);

  try {
    const data = await DB.order.findMany({
      skip: offset,
      take: Number(size),
      orderBy: {
        id: "desc",
      },
    });

    const count = await DB.order.count();

    return { data, count, page, pageSize: size };
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// get by id
export const getById = async (id) => {
  try {
    const data = await DB.order.findUnique({
      where: { id: Number(id) },
      include: { client: true },
    });

    return data;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// get for customer
export const getForCustomer = async (clientId) => {
  try {
    const data = await DB.order.findMany({
      where: { clientId: Number(clientId) },
      skip: 0,
      take: 50,
      orderBy: { id: "desc" },
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
    await DB.order.create({ data });

    return "created";
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// create
export const update = async (id, data) => {
  try {
    await DB.order.update({ where: { id: Number(id) }, data });

    return "updated";
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// create
export const deleteData = async (id) => {
  try {
    await DB.order.delete({ where: { id: Number(id) } });

    return "deleted";
  } catch (error) {
    console.log(error);
    return "error";
  }
};
