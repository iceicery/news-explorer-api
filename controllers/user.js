const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const user = require('../models/user');
const { get } = require('mongoose');

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

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      const user = new User({
        email,
        password: hash,
        name,
      });
      user.save()
        .then((data) => {
          if (!data) {
            res.status(StatusCodes.BAD_REQUEST)
              .send({ message: getReasonPhrase(StatusCodes.BAD_REQUEST) });
          }
          res.status(StatusCodes.OK).send(data);
        })
        .catch((err) => {
          if (err.name === 'validationError' || 'MongoError') {
            return res.status(StatusCodes.BAD_REQUEST);
          }
          next(err);
        });
    });
};

module.exports = { getUserMe, createUser };