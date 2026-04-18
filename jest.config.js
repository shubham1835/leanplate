module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterFramework: ["@testing-library/jest-dom"],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
    "^@core/(.*)$":     "<rootDir>/src/core/$1",
    "^@features/(.*)$": "<rootDir>/src/features/$1",
    "^@shared/(.*)$":   "<rootDir>/src/shared/$1",
    "^@config/(.*)$":   "<rootDir>/src/config/$1",
    "^@hooks/(.*)$":    "<rootDir>/src/hooks/$1",
    "^@assets/(.*)$":   "<rootDir>/src/assets/$1",
  },
  testMatch: ["**/__tests__/**/*.test.{js,jsx}"],
  transform: { "^.+\\.(js|jsx)$": "babel-jest" },
  collectCoverageFrom: [
    "src/features/**/hooks/*.js",
    "src/core/store/reducers/*.jsx",
  ],
};
