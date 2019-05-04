const express = require('express');
const router = express.Router();
const knex = require('../database/index');

router.get('/:user_id', (req, res) => {
  let userId = req.params.user_id;
  return knex
    .raw('SELECT * FROM users WHERE id = ?', [userId])
    .then((user) => {
      if (!user || !user.rowCount) {
        throw `{USER NOT FOUND}`;
      }
      return knex.raw(
        `SELECT products.* FROM carts JOIN products ON (carts.product_id = products.id) JOIN users ON (carts.user_id = users.id) WHERE user_id = ?`,
        [user.rows[0].id],
      );
    })
    .then((returnProducts) => {
      res.send(returnProducts.rows);
    })
    .catch((err) => {
      res.send('erro' + err);
    });
});

router.post('/:user_id/:product_id', (req, res) => {
  let userId = req.params.user_id;
  let productId = req.params.product_id;
  return knex
    .raw('SELECT * FROM users WHERE id = ?', [userId])
    .then((user) => {
      if (!user || !user.rowCount) {
        throw `{USER NOT FOUND}`;
      }
      return knex.raw(`SELECT * FROM products WHERE id = ?`, [productId]);
    })
    .then((product) => {
      if (!product || !product.rowCount) {
        throw `{PRODUCT NOT FOUND}`;
      }
      return knex.raw('INSERT INTO carts (user_id, product_id) VALUES (?, ?) RETURNING *', [userId, productId]);
    })
    .then((cart) => {
      return res.send(cart.rows);
    });
});

router.delete('/:user_id/:product_id', (req, res) => {
  let userId = req.params.user_id;
  let productId = req.params.product_id;
  return knex
    .raw('SELECT * FROM users WHERE id = ?', [userId])
    .then((user) => {
      if (!user || !user.rowCount) {
        throw `{USER NOT FOUND}`;
      }
      return knex.raw(`SELECT * FROM products WHERE id = ?`, [productId]);
    })
    .then((product) => {
      if (!product || !product.rowCount) {
        throw `{PRODUCT NOT FOUND}`;
      }
      return knex.raw('DELETE FROM carts WHERE user_id = ? and product_id = ? RETURNING *', [userId, productId]);
    })
    .then((cart) => {
      return res.send(cart.rows);
    });
});

module.exports = router;
