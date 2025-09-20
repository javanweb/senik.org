
exports.up = function(knex) {
  return knex.schema
    .createTable('themes', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.jsonb('styles'); // For storing theme-specific styles like colors, fonts, etc.
      table.timestamps(true, true);
    })
    .then(function() {
      return knex.schema.table('sites', function(table) {
        table.integer('theme_id').unsigned().references('id').inTable('themes').onDelete('SET NULL');
      });
    });
};

exports.down = function(knex) {
  return knex.schema.table('sites', function(table) {
    table.dropColumn('theme_id');
  })
  .then(function() {
    return knex.schema.dropTable('themes');
  });
};
