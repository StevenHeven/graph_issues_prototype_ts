module.exports = {
  globals: {
    "ts-test": {
      useBabelrc: true
    }
  },
  rootDir: 'src',
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: '/__tests__/.*\\.test\\.(js|ts|tsx)$',
  moduleFileExtensions: [ "ts", "tsx", "js" ],
  moduleNameMapper: {
    "^components/(.*)$": "<rootDir>/components/$1",
    "\\.(css|scss)$": "identity-obj-proxy"
  },
  setupTestFrameworkScriptFile: '<rootDir>/setupTests.ts',
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    "!node_modules/**",
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60
    },
    "./src/api/": {
      lines: 80
    },
    "./src/utils/": {
      lines: 80
    }
  }
};
