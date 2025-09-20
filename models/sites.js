
const knex = require('../db/knex');

module.exports = {
  getAll() {
    return knex('sites');
  },

  async getFullSiteById(id) {
    const site = await knex('sites').where('sites.id', id).first();
    if (!site) return null;

    const theme = await knex('themes').where('id', site.theme_id).first();
    const hero = await knex('heroes').where('site_id', id).first();
    const about = await knex('about_us').where('site_id', id).first();
    const timelineItems = about ? await knex('timeline_items').where('about_us_id', about.id) : [];
    const statistics = await knex('statistics').where('site_id', id);
    const features = await knex('features').where('site_id', id);

    return {
      ...site,
      theme: theme ? JSON.parse(theme.styles) : {},
      hero,
      about: {
        ...about,
        timeline: timelineItems,
      },
      stats: statistics.reduce((acc, stat) => {
        let key = stat.title.toLowerCase().replace(/\s/g, '');
        if (key.includes('تجربه')) key = 'experience';
        if (key.includes('مشتریان')) key = 'customers';
        if (key.includes('تیم')) key = 'team';
        if (key.includes('رضایت')) key = 'satisfaction';
        acc[key] = { value: stat.value, label: stat.title };
        return acc;
      }, {}),
      features: {
        title: 'برخی از نرم افزار های سه نیک', // This might need to be dynamic
        items: features.map(f => ({
          icon: f.icon,
          title: f.title,
          points: f.description.split('\n'),
        })),
      },
    };
  },

  getById(id) {
    return knex('sites').where('id', id).first();
  },

  create(site) {
    return knex('sites').insert(site, '*');
  },

  update(id, site) {
    return knex('sites').where('id', id).update(site, '*');
  },

  delete(id) {
    return knex('sites').where('id', id).del();
  }
};
