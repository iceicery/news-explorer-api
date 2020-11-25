const { StatusCodes, getReasonPhrase } = require("http-status-codes");
const jwt = require('jsonwebtoken');
const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: getReasonPhrase(StatusCodes.UNAUTHORIZED) })
  }
  const token = authorization.replace('Bearer ', '');
  const secretKeyDev = '873d6954eb73e83cdd4c3de9bca3a3ed224985c687777119c6c3564c87b9e7e9';
  let payload;
  try {
    payload = jwt.verify(token, secretKeyDev);
  } catch (err) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: getReasonPhrase(StatusCodes.UNAUTHORIZED) });
    next(err);
  }
  req.user = payload;
  next();
}

module.exports = auth;