exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert([
        { email: 'test1@email.com', password: 'mypass' },
        { email: 'test2@email.com', password: 'apple' },
        { email: 'test3@email.com', password: 'banana' },
      ]);
    });
};
