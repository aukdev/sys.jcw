import DB from "../../db/db.mjs";

// get all teams
export const getAllTeams = async () => {
  try {
    const data = await DB.team.findMany({ where: { deletedAt: null } });
    return data;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// get team
export const getTeam = async (id) => {
  try {
    const data = await DB.team.findUnique({
      where: { id: Number(id) },
      include: { Members: true },
    });
    return data;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// create new team
export const createTeam = async (data) => {
  try {
    const newData = await DB.team.create({ data });
    return newData;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// update
export const update = async (id, data) => {
  try {
    const updateData = await DB.team.update({
      where: { id: Number(id) },
      data,
    });
    return updateData;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// update
export const deleteTeam = async (id) => {
  try {
    await DB.team.update({
      where: { id: Number(id) },
      data: {
        deletedAt: new Date(),
      },
    });
    return "deleted data";
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// add members to team
export const addMembers = async (id, data = []) => {
  try {
    await DB.team.update({
      where: { id: Number(id) },
      data: {
        Members: {
          connect: data.map((d) => ({ id: Number(d) })),
        },
      },
    });
    return "members added";
  } catch (error) {
    console.log(error);
    return "error";
  }
};

// add members to team
export const deleteMembers = async (id, data = []) => {
  try {
    await DB.team.update({
      where: { id: Number(id) },
      data: {
        Members: {
          disconnect: data.map((d) => ({ id: Number(d) })),
        },
      },
    });
    return "members deleted";
  } catch (error) {
    console.log(error);
    return "error";
  }
};
