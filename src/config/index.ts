module.exports = {
  DB_CONFIG: {
    url: process.env.DB_URL || 'mongodb://localhost:27017/auth-service',
  },
  JWT_CONFIG: {
    secret: process.env.JWT_SECRET || 'secret',
  },
};
