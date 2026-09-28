require('dotenv').config();

const baseConfig = {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  define: {
    timestamps: true,
    underscored: true,
    undescoredAll: true,
    'createdAt': 'created_at',
    'updateAt': 'update_at'
  },
  logging: false
};

if (process.env.NODE_ENV === 'test') {
  module.exports = {
    ...baseConfig,
    dialect: 'sqlite',
    storage: ':memory:'
  };
} else {
  module.exports = {
    ...baseConfig,
    dialect: 'mysql',
    dialectOptions: {
      timezone: 'America/Sao_Paulo',
      allowPublicKeyRetrieval: true
    },
    timezone: 'America/Sao_Paulo'
  };
}
