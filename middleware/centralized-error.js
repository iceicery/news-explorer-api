const errmessage = require('../const/err-message');

const CentralizedError = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({
      message: statusCode === 500
        ? errmessage.serverErr
        : message,
    });
  next();
};

module.exports = { CentralizedError };
