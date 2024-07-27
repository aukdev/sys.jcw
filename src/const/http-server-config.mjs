export const PORT = process.env.PORT || 4000;

export const HTTPSTATUS = {
  OK: 200,
  CREATED: 201,
  // ERRORS
  SERVER_ERROR: 500,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
};

export const HTTPSTATUS_MSG = {
  OK: "success",
  CREATED: "created",
  // ERRORS
  SERVER_ERROR: "internal server error",
  NOT_FOUND: "data not found",
  BAD_REQUEST: "bad request",
  UNAUTHORIZED: "you have no permission to access",
  DATA_ALREADY_EXIST: "data already exist in DB",
};
