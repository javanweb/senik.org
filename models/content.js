
const knex = require('../db/knex');

const tables = {
  heroes: 'heroes',
  about_us: 'about_us',
  statistics: 'statistics',
  features: 'features',
  services: 'services',
  testimonials: 'testimonials',
  portfolios: 'portfolios',
  teams: 'teams',
  contacts: 'contacts',
  social_links: 'social_links'
};

const contentModel = {};

Object.keys(tables).forEach(tableName => {
  const table = tables[tableName];

  contentModel[tableName] = {
    getAllBySite(siteId) {
      return knex(table).where('site_id', siteId);
    },
    create(data) {
      return knex(table).insert(data, '*');
    },
    update(id, data) {
      return knex(table).where('id', id).update(data, '*');
    },
    delete(id) {
      return knex(table).where('id', id).del();
    }
  };
});

module.exports = contentModel;
