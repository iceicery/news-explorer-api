const articleRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getArticles, createArticles, deleteArticles } = require('../controllers/article');

articleRouter.get('/', getArticles);
articleRouter.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().uri(),
    image: Joi.string().required().uri(),
  }),
}), createArticles);
articleRouter.delete('/:articleId', deleteArticles);

module.exports = articleRouter;
