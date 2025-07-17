// jest.config.js
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testMatch: [
    "**/test/**/*.test.ts",
    "**/src/**/*.test.ts", // Add this line to include tests in src/
  ],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\.tsx?$': ['ts-jest', { useESM: true }],
  },
  moduleNameMapper: {
    '^(\.{1,2}/.*)\.js$': '$1',
  },
  extensionsToTreatAsEsm: ['.ts'],
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/']
}; 