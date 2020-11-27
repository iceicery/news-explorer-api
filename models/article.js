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
        return validatorPkg.isURL(v);
      },
      message: 'please enter valid url',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validatorPkg.isURL(v);
      },
      message: 'please enter valid url',
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
        return Promise.reject(new Error('no article'))
          .catch((err) => { console.log(err); });
      }
      if (article.owner !== userId) {
        return Promise.reject(new Error('not owner'))
          .catch((err) => { console.log(err); });
      }
      this.deleteOne();
      return article;
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = mongoose.model('article', articleSchema);
