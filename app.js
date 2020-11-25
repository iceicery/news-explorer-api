const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRouter = require('./routes/user');
const articleRouter = require('./routes/article');

const app = express();
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
app.use('/users', userRouter);
app.use('/articles', articleRouter);
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({
      message: statusCode === 500
        ? 'An error occurred on the server'
        : message,
    });
});
app.listen(PORT);
