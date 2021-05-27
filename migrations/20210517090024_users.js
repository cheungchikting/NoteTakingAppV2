exports.up = function(knex) {
  return knex.schema.createTable("users", (table)=>{
      table.increments();
      table.string("name");
      table.string("facebookid");
      table.string("googleid");
      table.string("email")
      table.string("hash");
      table.string("accessToken");
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("users")
};
