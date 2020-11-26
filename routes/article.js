const articleRouter = require('express').Router();
const { getArticles, createArticles, deleteArticles, checkOwner } = require('../controllers/article');

articleRouter.get('/', getArticles);
articleRouter.post('/', createArticles);
articleRouter.delete('/:articleId', deleteArticles);

module.exports = articleRouter;