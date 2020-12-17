const mongoose = require('mongoose');
const validatorPkg = require('validator');
const errmessage = require('../const/err-message');
const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found');

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
        return validatorPkg.isURL(v);
      },
      message: errmessage.enterUrl,
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validatorPkg.isURL(v);
      },
      message: errmessage.enterUrl,
    },
  },
  owner: {
    type: String,
    required: true,
    select: false,
  },
});

articleSchema.statics.removeArticleByOwner = function (articleID, userId) {
  return this.findById(articleID).select('owner')
    .then((article) => {
      if (!article) {
        throw new BadRequestError(errmessage.notId);
      }
      if (article.owner !== userId) {
        throw new BadRequestError(errmessage.notOwner);
      }
      return this.findByIdAndRemove(articleID)
        .then((card) => {
          if (!card) {
            throw new BadRequestError(errmessage.badRequest);
          }
          return card;
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

articleSchema.statics.getArticlesByOwner = function (userId) {
  return this.find({ owner: userId })
    .then((articles) => {
      if (!articles) {
        throw new NotFoundError(errmessage.notFound);
      }
      return articles;
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = mongoose.model('article', articleSchema);
