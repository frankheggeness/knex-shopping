'use strict';
const express = require('express');
const knex = require('./database');

const PORT = 3000;
const carts = require('./routes/carts.js');
const products = require('./routes/products.js');
const users = require('./routes/users.js');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/carts', carts);
app.use('/products', products);
app.use('/users', users);

app.post('/', (req, res) => {
  res.send('smoke test');
});

const server = app.listen(PORT, () => {
  console.log(`Express app is running at port ${PORT}`);
});
