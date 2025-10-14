export const errorHandler = (err, req, res, next) => {
  console.error(" Error caught by middleware:", err.stack || err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
};
