
const knex = require('../knexfile').development;
const db = require('knex')(knex);

const TABLE_NAME = 'themes';

module.exports = {
  getAll() {
    return db(TABLE_NAME).select();
  },

  getById(id) {
    return db(TABLE_NAME).where('id', id).first();
  },

  create(theme) {
    return db(TABLE_NAME).insert(theme, '*');
  },

  update(id, theme) {
    return db(TABLE_NAME).where('id', id).update(theme, '*');
  },

  delete(id) {
    return db(TABLE_NAME).where('id', id).del();
  }
};
