const express = require('express');
// listen to port 3000
const { PORT = 3000 } = process.env;
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/admin', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.listen(PORT);
