
exports.up = function(knex) {
  return knex.schema.createTable('timeline_items', function(table) {
    table.increments('id').primary();
    table.integer('about_us_id').unsigned().references('id').inTable('about_us').onDelete('CASCADE');
    table.string('year').notNullable();
    table.string('title').notNullable();
    table.text('description').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('timeline_items');
};
