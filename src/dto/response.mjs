export const clientResponse = (message, status, data, error) => ({
  message,
  status,
  data,
  error,
});

export const RESPONSE = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};
