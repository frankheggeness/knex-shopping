exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('products')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('products').insert([
        { title: 'Old Shoe', description: 'Literally an old shoe. It stinks.', inventory: 17, price: 17.69 },
        {
          title: 'Used Napkin',
          description: 'Your finger sticks to the moist surface. Why did you touch this?',
          inventory: 10002,
          price: 1.25,
        },
        {
          title: 'Half-empty Plastic Water Bottle',
          description: 'It has been sitting in the fridge for a few weeks. Maybe buy something else.',
          inventory: 3235,
          price: 32.25,
        },
      ]);
    });
};
