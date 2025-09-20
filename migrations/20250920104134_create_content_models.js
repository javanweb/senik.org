
exports.up = function(knex) {
  return knex.schema
    .createTable('heroes', function (table) {
      table.increments('id');
      table.integer('site_id').unsigned().references('id').inTable('sites');
      table.string('title', 255);
      table.string('subtitle', 255);
      table.string('background_image', 255);
    })
    .createTable('about_us', function (table) {
      table.increments('id');
      table.integer('site_id').unsigned().references('id').inTable('sites');
      table.string('title', 255);
      table.text('description');
      table.json('list');
    })
    .createTable('statistics', function (table) {
      table.increments('id');
      table.integer('site_id').unsigned().references('id').inTable('sites');
      table.string('title', 255);
      table.integer('value');
      table.string('icon', 255);
    })
    .createTable('features', function (table) {
      table.increments('id');
      table.integer('site_id').unsigned().references('id').inTable('sites');
      table.string('title', 255);
      table.text('description');
      table.string('icon', 255);
    })
    .createTable('services', function (table) {
      table.increments('id');
      table.integer('site_id').unsigned().references('id').inTable('sites');
      table.string('title', 255);
      table.text('description');
      table.string('icon', 255);
    })
    .createTable('testimonials', function (table) {
      table.increments('id');
      table.integer('site_id').unsigned().references('id').inTable('sites');
      table.string('name', 255);
      table.string('role', 255);
      table.text('quote');
      table.string('avatar', 255);
    })
    .createTable('portfolios', function (table) {
      table.increments('id');
      table.integer('site_id').unsigned().references('id').inTable('sites');
      table.string('title', 255);
      table.string('category', 255);
      table.string('image', 255);
      table.string('link', 255);
    })
    .createTable('teams', function (table) {
      table.increments('id');
      table.integer('site_id').unsigned().references('id').inTable('sites');
      table.string('name', 255);
      table.string('role', 255);
      table.string('image', 255);
      table.json('social');
    })
    .createTable('contacts', function (table) {
      table.increments('id');
      table.integer('site_id').unsigned().references('id').inTable('sites');
      table.string('address', 255);
      table.string('email', 255);
      table.string('phone', 255);
    })
    .createTable('social_links', function (table) {
      table.increments('id');
      table.integer('site_id').unsigned().references('id').inTable('sites');
      table.string('platform', 255);
      table.string('url', 255);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('social_links')
    .dropTable('contacts')
    .dropTable('teams')
    .dropTable('portfolios')
    .dropTable('testimonials')
    .dropTable('services')
    .dropTable('features')
    .dropTable('statistics')
    .dropTable('about_us')
    .dropTable('heroes');
};
