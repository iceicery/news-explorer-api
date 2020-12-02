const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const helmet = require('helmet');
const mainRouter = require('./routes/index');
const { createUser, login } = require('./controllers/user');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { limiter } = require('./middleware/limiter');
const { CentralizedError } = require('./middleware/centralized-error');
const mongolink = require('./config/mongo-link');
const errmessage = require('./const/err-message');
const NotFoundError = require('./errors/not-found');

const app = express();
app.use(limiter);
app.use(helmet());
const { PORT = 3000 } = process.env;
app.use(bodyParser.json());
mongoose.connect(mongolink,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
app.use(cors());
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(errmessage.serverCrash);
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
app.use('/', mainRouter);
app.use(() => {
  throw new NotFoundError(errmessage.requestNotFound);
});
app.use(errors());
app.use(errorLogger);
app.use(CentralizedError);
app.listen(PORT);
