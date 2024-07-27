const { clientResponse, RESPONSE_MSG } = require("../lib/DTO/response-dto");
const {
  loginDataValidate,
  dataDecryption,
  dataEncryption,
} = require("../lib/auth-validation/login-data-validation");
const router = require("express").Router();
const { prisma } = require("../config/config");
const { createToken, verifyToken } = require("../lib/auth-validation/jwt");
const AUTH_ERROR = require("../lib/const/errors/auth");
const COMMON_ERROR = require("../lib/const/errors/common");
const HTTPSTATUS = require("../lib/const/status/http-status");

router.get("/", (req, res) => {
  const token = req.headers.authorization;

  // check user send token available or not
  if (token === undefined) {
    res
      .status(AUTH_ERROR.UNAUTHORIZED.STATUS)
      .json(
        clientResponse(RESPONSE_MSG.ERROR, null, AUTH_ERROR.UNAUTHORIZED.ERROR)
      );
    return;
  }
  // check token
  const decryptToken = verifyToken(token.split(" ")[1]);
  if (decryptToken === null) {
    res
      .status(COMMON_ERROR.SERVER.STATUS)
      .json(
        clientResponse(RESPONSE_MSG.ERROR, null, COMMON_ERROR.SERVER.ERROR)
      );
    return;
  }
  req.user = decryptToken;
  console.log(decryptToken);
  res.sendStatus(HTTPSTATUS.OK.STATUS);
});

// login
router.post("/login", async (req, res) => {
  // user data
  const { username, password } = req.body;
  // user data validation
  const check = loginDataValidate({ username, password }, [
    "username",
    "password",
  ]);
  if (check.msg !== "ok") {
    res
      .status(AUTH_ERROR.INPUT.STATUS)
      .json(clientResponse(RESPONSE_MSG.ERROR, null, AUTH_ERROR.INPUT.ERROR));
    return;
  }

  //   read database
  try {
    const user = await prisma.systemUser.findUnique({
      where: {
        Username: username,
      },
      include: {
        Role: true,
      },
    });

    //
    if (user) {
      // decrypt password
      const originalPass = dataDecryption(
        user.Password,
        process.env.PASS_ENCRYPTION_KEY
      );

      // password check
      if (originalPass === password) {
        const paload = {
          username,
          role: user.Role.Type,
          access: JSON.parse(user.Role.Access),
        };
        // gen token
        const token = createToken(paload);
        if (token === null) {
          res
            .status(COMMON_ERROR.SERVER.STATUS)
            .json(
              clientResponse(
                RESPONSE_MSG.ERROR,
                null,
                COMMON_ERROR.SERVER.ERROR
              )
            );
          return;
        }
        paload.token = token;

        // send token and userdata to client
        res
          .status(HTTPSTATUS.OK.STATUS)
          .json(clientResponse(RESPONSE_MSG.SUCCESS, paload, null));
      } else {
        // send password error to client
        res
          .status(AUTH_ERROR.PASSWORD.STATUS)
          .json(
            clientResponse(RESPONSE_MSG.ERROR, null, AUTH_ERROR.PASSWORD.ERROR)
          );
      }
    } else {
      // send username error to client
      res
        .status(AUTH_ERROR.USERNAME.STATUS)
        .json(
          clientResponse(RESPONSE_MSG.ERROR, null, AUTH_ERROR.USERNAME.ERROR)
        );
    }
  } catch (error) {
    // internal server error
    console.log(error);
    res
      .status(COMMON_ERROR.SERVER.STATUS)
      .json(
        clientResponse(RESPONSE_MSG.ERROR, null, COMMON_ERROR.SERVER.ERROR)
      );
  }
});

// Regisger
router.post("/register", async (req, res) => {
  // user data
  const { username, password, name, roleId } = req.body;
  // user data validation
  const check = loginDataValidate({ username, password, name, roleId }, [
    "username",
    "password",
    "name",
    "roleId",
  ]);
  if (check.msg !== "ok") {
    res
      .status(AUTH_ERROR.INPUT.STATUS)
      .json(
        clientResponse(RESPONSE_MSG.ERROR, null, AUTH_ERROR.REG_INPUT.ERROR)
      );
    return;
  }

  // password encription
  const encryptPassword = dataEncryption(
    password,
    process.env.PASS_ENCRYPTION_KEY
  );

  // console.log("password", encryptPassword);
  // write data to database
  try {
    const user = await prisma.systemUser.create({
      data: {
        Name: name,
        Username: username,
        Password: encryptPassword,
        Email: req.body.email ? req.body.email : null,
        roleId: Number(roleId),
      },
      include: {
        Role: true,
      },
    });

    const paload = {
      id: user.id,
      name,
      username,
      email: user.Email,
      role: user.Role.Type,
      access: JSON.parse(user.Role.Access),
    };

    res
      .status(HTTPSTATUS.CREATED.STATUS)
      .json(clientResponse(RESPONSE_MSG.SUCCESS, paload, null));
  } catch (error) {
    console.log(error?.meta?.target);
    if (error?.code === "P2002") {
      res
        .status(COMMON_ERROR.DATA_ALREADY_EXIST.STATUS)
        .json(
          clientResponse(
            RESPONSE_MSG.ERROR,
            null,
            COMMON_ERROR.DATA_ALREADY_EXIST.ERROR
          )
        );
    } else {
      res
        .status(COMMON_ERROR.SERVER.STATUS)
        .json(
          clientResponse(RESPONSE_MSG.ERROR, null, COMMON_ERROR.SERVER.ERROR)
        );
    }
  }
});

module.exports = router;
