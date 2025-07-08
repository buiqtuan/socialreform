/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/.."],
  testMatch: [
    "<rootDir>/../integration/**/*.test.ts",
    "<rootDir>/../integration/**/*.spec.ts",
  ],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/setup-tests.ts"],
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/../../src/$1",
  },
  testTimeout: 30000,
  collectCoverageFrom: [
    "<rootDir>/../../src/**/*.ts",
    "!<rootDir>/../../src/**/*.d.ts",
    "!<rootDir>/../../src/**/types.ts",
  ],
  coverageDirectory: "<rootDir>/../coverage",
  coverageReporters: ["text", "lcov", "html"],
  clearMocks: true,
  restoreMocks: true,
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
};
