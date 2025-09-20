
exports.up = function(knex) {
  return knex.schema
    .createTable('users', function (table) {
      table.increments('id');
      table.string('name', 255).notNullable();
      table.string('email', 255).notNullable().unique();
      table.string('password', 255).notNullable();
      table.timestamps(true, true);
    })
    .createTable('sites', function (table) {
      table.increments('id');
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.string('site_name', 255).notNullable();
      table.string('domain', 255).unique();
      table.json('metadata');
      table.timestamps(true, true);
    })
    .createTable('pages', function (table) {
      table.increments('id');
      table.integer('site_id').unsigned().references('id').inTable('sites');
      table.string('title', 255).notNullable();
      table.string('path', 255).notNullable();
      table.json('content');
      table.timestamps(true, true);
    })
    .createTable('widgets', function (table) {
      table.increments('id');
      table.string('name', 255).notNullable();
      table.string('type', 255).notNullable();
      table.json('settings');
      table.timestamps(true, true);
    })
    .createTable('page_widgets', function (table) {
        table.increments('id');
        table.integer('page_id').unsigned().references('id').inTable('pages');
        table.integer('widget_id').unsigned().references('id').inTable('widgets');
        table.integer('order');
        table.timestamps(true, true);
    })
    .createTable('settings', function (table) {
        table.increments('id');
        table.integer('site_id').unsigned().references('id').inTable('sites');
        table.string('key', 255).notNullable();
        table.string('value', 255).notNullable();
        table.timestamps(true, true);
    })
    .createTable('analytics', function(table) {
        table.increments('id');
        table.integer('site_id').unsigned().references('id').inTable('sites');
        table.string('event', 255).notNullable();
        table.json('data');
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('analytics')
    .dropTable('settings')
    .dropTable('page_widgets')
    .dropTable('widgets')
    .dropTable('pages')
    .dropTable('sites')
    .dropTable('users');
};
