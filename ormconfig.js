module.exports = [
  {
    name: 'default',
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'docker',
    database: process.env.DB_NAME || 'demo',
    synchronize: process.env.DB_SYNCHRONIZE == 'true',
    logging: process.env.DB_LOGGING == 'true',
    entities: ['dist/modules/**/*.entity.js'],
    migrations: ['./dist/database/migrations/*.js'],
    subscribers: ['./src/database/subscriber/*.js'],
    cli: {
      migrationsDir: './src/database/migrations',
    },
  },
]
