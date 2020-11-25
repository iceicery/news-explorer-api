const userRouter = require('express').Router();
const { getUserMe } = require('../controllers/user');

userRouter.get('/me', getUserMe);

module.exports = userRouter;