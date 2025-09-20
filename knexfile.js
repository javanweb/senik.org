
module.exports = {
  development: {
    client: 'mssql',
    connection: {
      server: 'DESKTOP-9U8SJC1\HOSSEIN0988', // e.g., 'localhost' or '192.168.1.100'
      user: 'sa',       // e.g., 'sa'
      password: '123',
      database: 'SiteSenik',
      options: {
        encrypt: true, // For Azure SQL or if you're using SSL
        trustServerCertificate: true // Change to false in production if you have a valid certificate
      }
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
};
