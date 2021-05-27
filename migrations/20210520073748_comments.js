
exports.up = function(knex) {
    return knex.schema.createTable("comments", (table)=>{
        table.increments();
        table.string("comment");
        table.integer('note_id').unsigned();
        table.foreign('note_id').references('notes.id')
        table.integer('user_id').unsigned();
        table.foreign('user_id').references('users.id')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("comments")
};
