const pathIgnorePatterns = ['<rootDir>/.git/', '<rootDir>/.next/'];
const nodeModulesPattern = '<rootDir>/node_modules/';

module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  // setupFilesAfterEnv: [
  //   './jest.setup.js',
  // ],
  testPathIgnorePatterns: [...pathIgnorePatterns, nodeModulesPattern],
  transformIgnorePatterns: [...pathIgnorePatterns, nodeModulesPattern],
  watchPathIgnorePatterns: [...pathIgnorePatterns, nodeModulesPattern],
  modulePathIgnorePatterns: pathIgnorePatterns,
};
