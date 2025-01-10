const { validationResult } = require("express-validator");

exports.validator = (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    const error = errors.array()[0];
    return response.status(400).json({ message: error.msg });
  }
  next();
};
