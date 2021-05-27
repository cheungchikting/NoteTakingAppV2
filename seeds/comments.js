
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('comments').del()
    .then(function () {
      // Inserts seed entries
      return knex('comments').insert([
        {comment: 'comment1', note_id: '1', user_id: '2'},
        {comment: 'comment2', note_id: '2', user_id: '2'},
        {comment: 'comment3', note_id: '2', user_id: '2'},
      ]);
    });
};
