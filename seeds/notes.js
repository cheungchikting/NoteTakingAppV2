
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('notes').del()
    .then(function () {
      // Inserts seed entries
      return knex('notes').insert([
        {note: 'Testing1', user_id: '1'},
        {note: 'Testing2', user_id: '1'}
      ]);
    });
};
