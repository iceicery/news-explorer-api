const mainRouter = require('express').Router();
const userRouter = require('./user');
const articleRouter = require('./article');

mainRouter.use('/users', userRouter);
mainRouter.use('/articles', articleRouter);

module.exports = mainRouter;
