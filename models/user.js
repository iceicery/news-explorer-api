const mongoose = require('mongoose');
const validatorpkg = require('validator');
const bcrypt = require('bcrypt');
const UnauthorizeError = require('../errors/unauthorized');
const errmessage = require('../const/err-message');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validatorpkg.isEmail(v);
      },
      message: errmessage.enterEmail,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizeError(errmessage.wrongEmail);
      }
      return bcrypt.compare(password, user.password)
        .then((isMatched) => {
          if (!isMatched) {
            throw new UnauthorizeError(errmessage.wrongPwd);
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
