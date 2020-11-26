const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const Article = require('../models/article');
const user = require('../models/user');

const getArticles = (req, res, next) => {
  Article.find({})
    .then((article) => {
      if (!article) {
        res.status(StatusCodes.NOT_FOUND).send(getReasonPhrase(StatusCodes.NOT_FOUND));
      }
      res.status(StatusCodes.OK).send(article);
    })
    .catch(next);
}

const createArticles = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  console.log(req.user._id);
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
        res.status(StatusCodes.BAD_REQUEST).send(getReasonPhrase(StatusCodes.BAD_REQUEST));
      }
      res.status(StatusCodes.CREATED).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(StatusCodes.BAD_REQUEST)
          .send({ message: getReasonPhrase(StatusCodes.BAD_REQUEST) });
      }
      next(err);
    })
}



const deleteArticles = (req, res, next) => {
  Article.removeArticleByOwner(req.params.articleId, req.user._id)
    .then((data) => {
      if (!data) {
        res.status(StatusCodes.NOT_FOUND).send({ message: getReasonPhrase(StatusCodes.NOT_FOUND) });
      }
      res.status(StatusCodes.OK).send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(StatusCodes.NOT_FOUND)
          .send({ message: getReasonPhrase(StatusCodes.NOT_FOUND) });
      }
      next(err);
    })
}



module.exports = { getArticles, createArticles, deleteArticles };