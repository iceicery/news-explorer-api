const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const UnauthorizeError = require('../errors/unauthorized');
const { NODE_ENV, JWT_SECRET } = require('../config/get-key');
const secretKeyDev = require('../config/dev-key');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new UnauthorizeError(getReasonPhrase(StatusCodes.UNAUTHORIZED));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : secretKeyDev);
  } catch (err) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: getReasonPhrase(StatusCodes.UNAUTHORIZED) });
    next(err);
  }
  req.user = payload;
  next();
};

module.exports = auth;
