const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const notFoundHandler = (_req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found.",
  });
};

const errorHandler = (error, _req, res, _next) => {
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error.",
  });
};

module.exports = {
  createHttpError,
  notFoundHandler,
  errorHandler,
};
