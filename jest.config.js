export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/__mocks__/fileMock.js',
    '^common/(.*)$': '<rootDir>/src/common/$1',
    '^assets/(.*)$': '<rootDir>/src/assets/$1',
    '^pages/(.*)$': '<rootDir>/src/pages/$1',
    '^core/(.*)$': '<rootDir>/src/core/$1',
    '^features/(.*)$': '<rootDir>/src/features/$1',
    '^store/(.*)$': '<rootDir>/src/store/$1',
    '^utils/(.*)$': '<rootDir>/src/utils/$1',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.(css|less|sass|scss)$': 'jest-transform-stub',
  },
}
