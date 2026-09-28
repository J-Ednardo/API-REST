module.exports = {
  clearMocks: true,
  testEnvironment: 'node',
  transform: {
    '^.+\\.jsx?$': '@sucrase/jest-plugin',
  },
  setupFiles: ['dotenv/config'],
};
