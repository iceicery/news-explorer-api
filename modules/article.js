const mongoose = require('mongoose');
const validatorPkg = require('validator');
const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        validatorPkg.isURL(v);
      },
      message: 'please enter valid url',
    }
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        validatorPkg.isURL(v);
      },
      message: 'please enter valid url',
    },
  },
  owner: {
    select: false,
  }


})

module.exports = mongoose.model('article', articleSchema);