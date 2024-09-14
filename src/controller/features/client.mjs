import { UserRole } from "@prisma/client";
import DB from "../../db/db.mjs";

// get all customers
export const getAllCustomers = async (page, size) => {
  const offset = (Number(page) - 1) * Number(size);
  try {
    const data = await DB.client.findMany({
      skip: offset,
      take: Number(size),
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        Name: true,
        Username: true,
        Email: true,
        Phone: true,
      },
      where: {
        Role: UserRole.User,
      },
    });

    const count = await DB.client.count({
      where: {
        Role: UserRole.User,
      },
    });

    return { data, count, page, pageSize: size };
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// get all customers
export const getAllStaff = async (page, size) => {
  const offset = (Number(page) - 1) * Number(size);
  try {
    const data = await DB.client.findMany({
      skip: offset,
      take: Number(size),
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        Name: true,
        Username: true,
        Email: true,
        Phone: true,
      },
      where: {
        Role: UserRole.Team,
      },
    });

    const count = await DB.client.count({
      where: {
        Role: UserRole.Team,
      },
    });

    return { data, count, page, pageSize: size };
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// get customer by id
export const getById = async (id) => {
  try {
    const data = await DB.client.findUnique({
      where: { id: Number(id) },
      select: {
        Name: true,
        Phone: true,
        Email: true,
        Address: true,
        Username: true,
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
    const newData = await DB.client.create({ data });
    return `new client created with id ${newData.id}`;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// search by phone
export const searchByPhone = async (phone) => {
  try {
    const data = await DB.client.findFirst({ where: { Phone: phone } });
    return data;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// check username
export const checkUsername = async (username) => {
  try {
    const count = await DB.client.count({ where: { Username: username } });
    if (count) return "data";
    else return "ok";
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// check phone
export const checkPhone = async (phone) => {
  try {
    const count = await DB.client.count({ where: { Phone: phone } });
    if (count) return "data";
    else return "ok";
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// update
export const update = async (id, data) => {
  try {
    const updateData = await DB.client.update({
      where: { id: Number(id) },
      data,
    });
    return `${updateData.id} client has been updated`;
  } catch (error) {
    console.log(error);
    return "error";
  }
};
