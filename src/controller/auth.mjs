import DB from "../db/db.mjs";

export const login = async (username, password) => {
  try {
    const user = await DB.client.findFirst({
      where: { Username: username },
      include: { Team: { where: { deletedAt: null } } },
    });
    if (user === null) {
      return "error";
    } else {
      if (user.Password === password) {
        const { Password, ...sendUser } = user;
        return sendUser;
      } else return "error";
    }
  } catch (error) {
    console.log(error);
    return "error";
  }
};
