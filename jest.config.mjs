// module.exports = {
//     testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
//     setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
//     transform: {
//         '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
//     },
//     testEnvironment: 'jsdom',
//     transformIgnorePatterns: [
//         'node_modules/(?!(module-that-needs-to-be-transformed)/)',
//     ],
//     moduleNameMapper: {
//         '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
//     },
// };

import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
    // Add more setup options before each test is run
    // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

    testEnvironment: 'jest-environment-jsdom',
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
