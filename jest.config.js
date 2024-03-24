/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
    displayName: "Mernspace Catalog Service",
    roots: ["<rootDir>"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    modulePathIgnorePatterns: [
        "<rootDir>/test/__fixtures__",
        "<rootDir>/node_modules",
        "<rootDir>/dist",
    ],
    testPathIgnorePatterns: ["<rootDir>/e2e"],
    preset: "ts-jest",
    testEnvironment: "node",
    verbose: true,
    collectCoverage: true,
    coverageProvider: "v8",
    collectCoverageFrom: [
        "<rootDir>/src/**/*.ts",
        "!<rootDir>/src/__tests__/**",
        "!**/node_modules/**",
    ],
};
