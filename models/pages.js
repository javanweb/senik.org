
const knex = require('../db/knex');

module.exports = {
  getAll() {
    return knex('pages');
  },

  getById(id) {
    return knex('pages').where('id', id).first();
  },

  create(page) {
    return knex('pages').insert(page, '*');
  },

  update(id, page) {
    return knex('pages').where('id', id).update(page, '*');
  },

  delete(id) {
    return knex('pages').where('id', id).del();
  }
};
