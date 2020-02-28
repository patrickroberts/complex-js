module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.ts',
    '!compiler/grammar.ts',
    '!docs/**',
    '!dst/**',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'docs'
};
