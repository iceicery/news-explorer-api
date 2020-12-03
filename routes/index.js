const mainRouter = require('express').Router();
const auth = require('../middleware/auth');
const userRouter = require('./user');
const articleRouter = require('./article');

mainRouter.use('/users', auth, userRouter);
mainRouter.use('/articles', auth, articleRouter);

module.exports = mainRouter;
