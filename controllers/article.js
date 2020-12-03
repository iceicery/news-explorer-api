const { StatusCodes } = require('http-status-codes');
const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found');
const Article = require('../models/article');
const errmessage = require('../const/err-message');

const getArticles = (req, res, next) => {
  Article.find({})
    .then((article) => {
      if (!article) {
        throw new NotFoundError('articles not found');
      }
      res.status(StatusCodes.OK).send(article);
    })
    .catch(next);
};

const createArticles = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const article = new Article({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  });
  article.save()
    .then((data) => {
      if (!data) {
        throw new BadRequestError(errmessage.badRequest);
      }
      res.status(StatusCodes.CREATED).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(errmessage.badRequest);
      }
    })
    .catch(next);
};

const deleteArticles = (req, res, next) => {
  Article.removeArticleByOwner(req.params.articleId, req.user._id)
    .then((data) => {
      if (!data) {
        throw new BadRequestError(errmessage.badRequest);
      }
      res.status(StatusCodes.OK).send(data);
    })
    .catch(next);
};

module.exports = { getArticles, createArticles, deleteArticles };
