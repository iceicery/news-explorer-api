const mainRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middleware/auth');
const userRouter = require('./user');
const articleRouter = require('./article');

mainRouter.use('/users', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }),
}), auth, userRouter);
mainRouter.use('/articles', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }),
}), auth, articleRouter);

module.exports = mainRouter;
