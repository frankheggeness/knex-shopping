const express = require('express');
const router = express.Router();
const knex = require('../database/index');

router.get('/', (req, res) => {
  return knex
    .raw('SELECT * FROM products')
    .then((products) => {
      res.send(products.rows);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.get('/:product_id', (req, res) => {
  let productId = req.params.product_id;
  return knex
    .raw('SELECT * FROM products WHERE id = ?', [productId])
    .then((product) => {
      if (!product || !product.rowCount) {
        // res.send('Error: product not found');
        throw `{PRODUCT NOT FOUND}`;
      }
      return product;
    })
    .then((product) => {
      res.send(product.rows);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post('/new', (req, res) => {
  let inputData = req.body;
  return knex
    .raw('SELECT title FROM products WHERE title = ?', [inputData.title])
    .then((product) => {
      if (!product || !product.rowCount) {
        return knex.raw('INSERT INTO products (title, description, inventory, price) VALUES (?, ?, ?, ?) RETURNING *', [
          inputData.title,
          inputData.description,
          inputData.inventory,
          inputData.price,
        ]);
      }
      throw `{product EXISTS}`;
    })
    .then((madeProduct) => {
      res.send(madeProduct.rows);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.put('/:product_id', (req, res) => {
  let inputData = req.body;
  let productId = req.params.product_id;
  return knex
    .raw('SELECT * FROM products WHERE id = ?', [productId])
    .then((product) => {
      if (!product || !product.rowCount) {
        throw `{Product NOT FOUND}`;
      }
      return knex.raw(
        `UPDATE products SET title = ?, description = ?, inventory = ?, price = ?  WHERE id = ? RETURNING *`,
        [inputData.title, inputData.description, inputData.inventory, inputData.price, product.rows[0].id],
      );
    })
    .then((newProduct) => {
      res.send(newProduct.rows);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.delete('/:product_id', (req, res) => {
  let productId = req.params.product_id;
  return knex
    .raw('SELECT * FROM products WHERE id = ?', [productId])
    .then((product) => {
      if (!product || !product.rowCount) {
        throw `{product NOT FOUND}`;
      }
      return knex.raw(`DELETE FROM products WHERE id = ? RETURNING *`, [productId]);
    })
    .then((newPass) => {
      res.send(`product ${productId} has been deleted`);
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
