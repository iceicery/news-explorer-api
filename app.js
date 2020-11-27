const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { StatusCodes } = require('http-status-codes');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const helmet = require('helmet');
const userRouter = require('./routes/user');
const articleRouter = require('./routes/article');
const { createUser, login } = require('./controllers/user');
const auth = require('./middleware/auth');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { limiter } = require('./middleware/limiter');

const app = express();
app.use(limiter);
app.use(helmet());
const { PORT = 3000 } = process.env;
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/admin',
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
app.use(cors());
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});
app.use(requestLogger);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.use('/users', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), auth, userRouter);
app.use('/articles', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), auth, articleRouter);
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND)
    .send({ message: 'Requested resource not found' });
});
app.use(errors());
app.use(errorLogger);
app.use((err, req, res) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({
      message: statusCode === 500
        ? 'An error occurred on the server'
        : message,
    });
});
app.listen(PORT);
