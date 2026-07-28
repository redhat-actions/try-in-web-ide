import js from "@eslint/js";
import tseslint from "typescript-eslint";
import jest from "eslint-plugin-jest";

export default tseslint.config(
    // Global ignores (replaces .eslintignore and ignorePatterns)
    {
        ignores: [
            "node_modules/",
            "dist/",
            "out/",
            "lib/",
            "coverage/",
            "__mocks__/",
            "eslint.config.mjs",
        ],
    },

    // Base recommended configs
    js.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,

    // Main config for all TypeScript files
    {
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: "module",
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            // Formatting rules (carried over from @redhat-actions/eslint-config)
            "array-bracket-spacing": [ "error", "always", { objectsInArrays: false, arraysInArrays: false }],
            "array-bracket-newline": [ "error", "consistent" ],
            "brace-style": [ "error", "stroustrup", { allowSingleLine: true } ],
            "comma-dangle": ["error", {
                arrays: "always-multiline",
                objects: "always-multiline",
                imports: "always-multiline",
                exports: "always-multiline",
                functions: "only-multiline",
            }],
            indent: [ "error", 4 ],
            curly: "error",
            "default-case-last": "error",
            eqeqeq: [ "error", "smart" ],
            "max-len": [ "error", 120, 4, {
                ignoreRegExpLiterals: true,
                ignoreStrings: false,
                ignoreTemplateLiterals: false,
                ignoreUrls: true,
            }],
            "no-console": "error",
            "no-else-return": [ "error", { allowElseIf: true }],
            "no-multi-spaces": [ "error", { ignoreEOLComments: true }],
            quotes: [ "error", "double", { allowTemplateLiterals: true }],
            semi: [ "error" ],

            // TypeScript rules
            "@typescript-eslint/explicit-function-return-type": [ "error", { allowExpressions: true }],
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/no-inferrable-types": [ "error", { ignoreParameters: true }],
            "@typescript-eslint/no-require-imports": "error",
            "@typescript-eslint/no-unused-vars": [ "error", { argsIgnorePattern: "^_" }],
            "@typescript-eslint/no-shadow": "error",
            "@typescript-eslint/no-useless-constructor": "error",
            "@typescript-eslint/prefer-for-of": "error",
            "@typescript-eslint/no-empty-object-type": "off",

            // Disables
            "no-shadow": "off",
            "no-useless-constructor": "off",
            "no-inner-declarations": "off",
            "no-plusplus": "off",

            // Project-specific rules (from .eslintrc.js)
            "class-methods-use-this": "off",
            "no-empty-function": [ "error", { allow: [ "constructors" ] }],
        },
    },

    // Test file overrides
    {
        files: ["**/*.spec.ts", "**/*.test.ts"],
        plugins: { jest },
        rules: {
            ...jest.configs.recommended.rules,
            "jest/valid-title": "off",
            "@typescript-eslint/no-floating-promises": "off",
            "@typescript-eslint/require-await": "off",
            "@typescript-eslint/await-thenable": "off",
            "@typescript-eslint/unbound-method": "off",
            "dot-notation": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-require-imports": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-return": "off",
        },
    },
);
