
exports.up = function(knex) {
  return knex.schema.createTable('notes', (table)=>{
      table.increments();
      table.string('note');
      table.json('file')
      table.integer('user_id').unsigned();
      table.foreign('user_id').references('users.id')
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("notes")
};
