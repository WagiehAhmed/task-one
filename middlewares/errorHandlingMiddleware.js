exports.notFoundError = (req, res, next) => {
  res.statusCode = 404;
  return next(new Error(`This Route ${req.originalUrl} Not Found.`));
};

exports.errorHandler = (err, req, res, next) => {
  if (err) {
    return res.status(err.statusCode || res.statusCode || 500).json({
      statusCode: err.statusCode || res.statusCode || 500,
      message: err.message,
    });
  }
};
