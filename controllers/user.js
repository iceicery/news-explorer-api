const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(StatusCodes.NOT_FOUND).send(getReasonPhrase(StatusCodes.NOT_FOUND));
      }
      res.status(StatusCodes.OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(StatusCodes.NOT_FOUND).send(getReasonPhrase(StatusCodes.NOT_FOUND));
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
          res.status(StatusCodes.CREATED).send(data);
        })
        .catch((err) => {
          if (err.name === 'validationError') {
            res.status(StatusCodes.BAD_REQUEST)
              .send({ message: getReasonPhrase(StatusCodes.BAD_REQUEST) });
          }
          if (err.name === 'MongoError') {
            res.status(StatusCodes.BAD_REQUEST)
              .send({ message: getReasonPhrase(StatusCodes.BAD_REQUEST) });
          }
          next(err);
        });
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .send({ message: 'Incorrect email or password' });
      }
      const secretKeyDev = '873d6954eb73e83cdd4c3de9bca3a3ed224985c687777119c6c3564c87b9e7e9';
      const token = jwt.sign(
        { _id: user._id },
        secretKeyDev,
        {
          expiresIn: '7d',
        },
      );
      res.status(StatusCodes.CREATED).send({ token });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .send({ message: 'Incorrect email or password' });
      }
      next(err);
    });
};

module.exports = { getUserMe, createUser, login };
