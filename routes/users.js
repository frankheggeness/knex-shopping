const express = require('express');
const router = express.Router();
const knex = require('../database/index');

// console.log(knex.select('*').from('users'));

router.get('/', (req, res) => {
  res.send('users test');
});
//

router.get('/:user_id', (req, res) => {
  let userId = req.params.user_id;
  return knex
    .raw('SELECT email, password FROM users WHERE id = ?', [userId])
    .then((user) => {
      if (!user || !user.rowCount) {
        // res.send('Error: user not found');
        throw `{USER NOT FOUND}`;
      }
      return user;
    })
    .then((user) => {
      res.send(user.rows);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post('/login', (req, res) => {
  let inputData = req.body;
  return knex
    .raw('SELECT id, password FROM users WHERE email = ?', [inputData.email])
    .then((user) => {
      if (!user || !user.rowCount) {
        throw `{USER NOT FOUND}`;
      }
      return user;
    })
    .then((user) => {
      if (inputData.password != user.rows[0].password) {
        res.send(`Does ${inputData.password} =  ${user.rows[0].password}?`);
      }
      return user;
    })
    .then((user) => {
      res.send(user.rows);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post('/register', (req, res) => {
  let inputData = req.body;
  return knex
    .raw('SELECT email FROM users WHERE email = ?', [inputData.email])
    .then((user) => {
      if (!user || !user.rowCount) {
        return knex.raw('INSERT INTO users (email, password) VALUES (?, ?) RETURNING *', [
          inputData.email,
          inputData.password,
        ]);
      }
      throw `{USER EXISTS}`;
    })
    .then((madeUser) => {
      res.send(madeUser.rows);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.put('/:user_id/forgot-password', (req, res) => {
  let inputData = req.body;
  let userId = req.params.user_id;
  return knex
    .raw('SELECT * FROM users WHERE id = ?', [userId])
    .then((user) => {
      if (!user || !user.rowCount) {
        throw `{USER NOT FOUND}`;
      }
      return knex.raw(`UPDATE users SET password = ? WHERE id = ? RETURNING *`, [inputData.password, user.rows[0].id]);
    })
    .then((newPass) => {
      res.send(newPass.rows);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.delete('/:user_id', (req, res) => {
  let userId = req.params.user_id;
  return knex
    .raw('SELECT * FROM users WHERE id = ?', [userId])
    .then((user) => {
      if (!user || !user.rowCount) {
        throw `{USER NOT FOUND}`;
      }
      return knex.raw(`DELETE FROM users WHERE id = ? RETURNING *`, [userId]);
    })
    .then((newPass) => {
      res.send(`User ${userId} has been deleted`);
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
