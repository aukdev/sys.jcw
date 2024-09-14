import DB from "../../db/db.mjs";

// get All of this month
export const getAll = async () => {
  try {
    const data = await DB.ads.findMany();

    return data;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// create
export const create = async (data) => {
  try {
    await DB.ads.create({ data });

    return "created";
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// create
export const update = async (id, data) => {
  try {
    await DB.ads.update({ where: { id: Number(id) }, data });

    return "updated";
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// create
export const deleteData = async (id) => {
  try {
    await DB.ads.delete({ where: { id: Number(id) } });

    return "deleted";
  } catch (error) {
    console.log(error);
    return "error";
  }
};
