module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/migrations/**',
        '!src/seeders/**',
        '!**/node_modules/**',
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
    setupFiles: ['./jest.setup.js'],
    verbose: true,
};