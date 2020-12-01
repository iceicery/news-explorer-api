const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found');
const Article = require('../models/article');

const getArticles = (req, res) => {
  Article.find({})
    .then((article) => {
      if (!article) {
        throw new NotFoundError('articles not found');
      }
      res.status(StatusCodes.OK).send(article);
    })
    .catch((err) => {
      if (err.name === 'Error') {
        res.status(StatusCodes.NOT_FOUND)
          .send({ message: getReasonPhrase(StatusCodes.NOT_FOUND) });
      }
    });
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
        throw new BadRequestError(getReasonPhrase(StatusCodes.BAD_REQUEST));
      }
      res.status(StatusCodes.CREATED).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST)
          .send({ message: getReasonPhrase(StatusCodes.BAD_REQUEST) });
      }
      next(err);
    });
};

const deleteArticles = (req, res, next) => {
  Article.removeArticleByOwner(req.params.articleId, req.user._id)
    .then((data) => {
      if (!data) {
        throw new NotFoundError('article not found');
      }
      res.status(StatusCodes.OK).send(data);
    })
    .catch((err) => {
      if (err.name === 'Error') {
        res.status(StatusCodes.NOT_FOUND)
          .send({ message: getReasonPhrase(StatusCodes.NOT_FOUND) });
      }
      next(err);
    });
};

module.exports = { getArticles, createArticles, deleteArticles };
