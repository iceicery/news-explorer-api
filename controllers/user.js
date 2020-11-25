const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const User = require('../models/user');

const getUserMe = (req, res, next) => {
  User.findById("5fbdd6dd71fbb0b2d35b4807")
    .then((user) => {
      if (!user) {
        res.status(StatusCodes.NOT_FOUND).send(getReasonPhrase(StatusCodes.NOT_FOUND));
        console.log('no data');
      }
      res.status(StatusCodes.OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(StatusCodes.NOT_FOUND).send(getReasonPhrase(StatusCodes.NOT_FOUND))
      }
      next(err);
    });
};

module.exports = { getUserMe };