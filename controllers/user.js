const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { NODE_ENV, JWT_SECRET } = require('../config/get-key');
const secretKeyDev = require('../config/dev-key');
const UnauthorizeError = require('../errors/unauthorized');
const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found');
const errmessage = require('../const/err-message');

const getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(errmessage.notFound);
      }
      res.status(StatusCodes.OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundError(errmessage.notFound);
      }
    })
    .catch(next);
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
            throw new BadRequestError(errmessage.badRequest);
          }
          res.status(StatusCodes.CREATED).send({ email: data.email, name: data.name });
        })
        .catch((err) => {
          if (err.name === 'validationError') {
            throw new BadRequestError(errmessage.badRequest);
          }
          if (err.name === 'MongoError') {
            throw new BadRequestError(errmessage.badRequest);
          }
        })
        .catch(next);
    })
    .catch(next);
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
        NODE_ENV === 'production' ? JWT_SECRET : secretKeyDev,
        {
          expiresIn: '7d',
        },
      );
      res.status(StatusCodes.CREATED).send({ token });
    })
    .catch(next);
};

module.exports = { getUserMe, createUser, login };
