const { prisma, UserRole } = require("../config/config");
const { clientResponse, RESPONSE_MSG } = require("../lib/DTO/response-dto");
const COMMON_ERROR = require("../lib/const/errors/common");
const HTTPSTATUS = require("../lib/const/status/http-status");

const router = require("express").Router();

// get all roles
router.get("/", async (req, res) => {
  console.log("role ", req.user);
  try {
    const allRoles = await prisma.role.findMany({
      select: {
        id: true,
        Access: true,
        Type: true,
      },
    });
    if (allRoles.length > 0) {
      res
        .status(HTTPSTATUS.OK.STATUS)
        .json(clientResponse(RESPONSE_MSG.SUCCESS, allRoles, null));
    } else {
      res
        .status(HTTPSTATUS.NOT_FOUND.STATUS)
        .json(
          clientResponse(RESPONSE_MSG.ERROR, null, COMMON_ERROR.NOT_FOUND.ERROR)
        );
    }
  } catch (error) {
    res
      .status(HTTPSTATUS.SERVER_ERROR.STATUS)
      .json(
        clientResponse(RESPONSE_MSG.ERROR, null, COMMON_ERROR.SERVER.ERROR)
      );
  }
});

// create new role
router.post("/", async (req, res) => {
  const { type, access } = req.body;

  if (type && access) {
    if (access.length > 0) {
      if (Object.keys(UserRole).includes(type)) {
        try {
          const newRole = await prisma.role.create({
            data: {
              Type: UserRole[type],
              Access: JSON.stringify(access),
            },
            select: {
              id: true,
              Type: true,
              Access: true,
            },
          });

          res
            .status(HTTPSTATUS.CREATED.STATUS)
            .json(clientResponse(RESPONSE_MSG.SUCCESS, newRole, null));
        } catch (error) {
          res
            .status(HTTPSTATUS.SERVER_ERROR.STATUS)
            .json(
              clientResponse(
                RESPONSE_MSG.ERROR,
                null,
                COMMON_ERROR.SERVER.ERROR
              )
            );
        }
      } else
        res
          .status(HTTPSTATUS.BAD_REQUEST.STATUS)
          .json(
            clientResponse(
              RESPONSE_MSG.ERROR,
              null,
              COMMON_ERROR.BAD_REQUEST.ERROR
            )
          );
    } else
      res
        .status(HTTPSTATUS.BAD_REQUEST.STATUS)
        .json(
          clientResponse(
            RESPONSE_MSG.ERROR,
            null,
            COMMON_ERROR.BAD_REQUEST.ERROR
          )
        );
  } else
    res
      .status(HTTPSTATUS.BAD_REQUEST.STATUS)
      .json(
        clientResponse(RESPONSE_MSG.ERROR, null, COMMON_ERROR.BAD_REQUEST.ERROR)
      );
});

module.exports = router;
