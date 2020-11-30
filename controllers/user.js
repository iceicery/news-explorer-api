const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { NODE_ENV, JWT_SECRET } = require('../utils/getKey');
const UnauthorizeError = require('../errors/unauthorized');
const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found');

const getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('user not found');
      }
      res.status(StatusCodes.OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(err.statusCode).send(err.message);
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
            throw new BadRequestError(getReasonPhrase(StatusCodes.BAD_REQUEST));
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
        throw new UnauthorizeError('Incorrect email or password');
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'secretKeyDev',
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
