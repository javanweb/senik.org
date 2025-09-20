
const knex = require('../db/knex');

module.exports = {
  getAll() {
    return knex('widgets');
  },

  getById(id) {
    return knex('widgets').where('id', id).first();
  },

  create(widget) {
    return knex('widgets').insert(widget, '*');
  },

  update(id, widget) {
    return knex('widgets').where('id', id).update(widget, '*');
  },

  delete(id) {
    return knex('widgets').where('id', id).del();
  }
};
