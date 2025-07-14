/** @type {import('jest').Config} */
module.exports = {
  // Test Environment Configuration
  testEnvironment: "node",
  rootDir: "../..",

  // Test Discovery
  testMatch: [
    "<rootDir>/tests/integration/**/*.test.js",
    "<rootDir>/tests/integration/**/*.spec.js",
  ],

  // Test Setup
  setupFilesAfterEnv: ["<rootDir>/tests/setup/test-setup.js"],
  testTimeout: 30000,

  // Coverage Configuration
  collectCoverageFrom: [
    "<rootDir>/src/**/*.js",
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/**/*.d.ts",
    "!<rootDir>/src/**/types.ts",
  ],
  coverageDirectory: "<rootDir>/tests/coverage",
  coverageReporters: ["text", "lcov", "html"],

  // Test Behavior
  clearMocks: true,
  restoreMocks: true,
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
};
