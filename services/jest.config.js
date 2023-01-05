module.exports = {
  verbose: true,
  projects: [
    {
      preset: 'ts-jest',
      testEnvironment: 'node',
      displayName: 'auth',
      setupFilesAfterEnv: ['./src/auth/test/setup.ts'],
      testMatch: ['<rootDir>/src/auth/**/*.test.ts'],
    },
    {
      preset: 'ts-jest',
      testEnvironment: 'node',
      displayName: 'tickets',
      setupFilesAfterEnv: ['./src/tickets/test/setup.ts'],
      testMatch: ['<rootDir>/src/tickets/**/*.test.ts'],
    },
    {
      preset: 'ts-jest',
      testEnvironment: 'node',
      displayName: 'orders',
      setupFilesAfterEnv: ['./src/orders/test/setup.ts'],
      testMatch: ['<rootDir>/src/orders/**/*.test.ts'],
    },
    {
      preset: 'ts-jest',
      testEnvironment: 'node',
      displayName: 'payments',
      setupFilesAfterEnv: ['./src/payments/test/setup.ts'],
      testMatch: ['<rootDir>/src/payments/**/*.test.ts'],
    },
  ],
};
