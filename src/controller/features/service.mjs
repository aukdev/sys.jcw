import DB from "../../db/db.mjs";

// get all
export const getAll = async () => {
  try {
    const data = await DB.serviceType.findMany({
      include: {
        Services: {
          where: { deletedAt: null },
        },
      },
      where: { deletedAt: null },
    });
    return data;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// get type by id
export const getTypeById = async (id) => {
  try {
    const data = await DB.serviceType.findUnique({
      where: { id: Number(id) },
      include: {
        Services: {
          where: { deletedAt: null },
        },
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// create new service type
export const createType = async (data) => {
  try {
    const newSerType = await DB.serviceType.create({
      data,
    });
    return newSerType;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// update service type
export const updateType = async (id, data) => {
  try {
    const updateData = await DB.serviceType.update({
      where: { id: Number(id) },
      data,
    });
    return updateData;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// delete service type
export const deleteType = async (id) => {
  try {
    const updateData = await DB.serviceType.update({
      where: { id: Number(id) },
      data: {
        deletedAt: new Date(),
      },
    });
    return updateData;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// create service
export const createService = async (data) => {
  try {
    const newData = await DB.service.create({ data });
    return newData;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// update service
export const updateService = async (id, data) => {
  try {
    const updateData = await DB.service.update({
      where: { id: Number(id) },
      data,
    });
    return updateData;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// delete service
export const deleteService = async (id) => {
  try {
    const updateData = await DB.service.update({
      where: { id: Number(id) },
      data: {
        deletedAt: new Date(),
      },
    });
    return updateData;
  } catch (error) {
    console.log(error);
    return "error";
  }
};
