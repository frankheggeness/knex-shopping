const express = require('express');
const router = express.Router();

// const articlesData = require('../database/articles.js');
// const articlesArray = articlesData.getArticlesArray();
// const articlesObject = articlesData.getArticlesObject();

//
router
  .route('/')
  .get((req, res) => {
    if (articlesObject.messageCheck === false) {
      articlesObject.message = '';
    } else {
      articlesObject.messageCheck = false;
    }
    res.status(200);
    return res.render('./templates/articles/index', articlesObject);
  })
  .post((req, res) => {
    let body = req.body;
    articlesData.postArticle(body);
    return res.render('./templates/articles/index', articlesObject);
  });

module.exports = router;
