const mongoose = require('mongoose');
const validatorpkg = require('validator');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validatorpkg.isEmail(v);
      },
      message: 'please enter an email',
    }
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
  }
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect email'));
      }
      return bcrypt.compare(password, user.password)
        .then((isMatched) => {
          if (!isMatched) {
            return Promise.reject(new Error('Incorrect password'));
          }
          return user;
        });
    });
}

module.exports = mongoose.model('user', userSchema);