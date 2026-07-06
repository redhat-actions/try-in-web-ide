module.exports = {
    extends: [
        "@redhat-actions/eslint-config",
    ],
    ignorePatterns: [
        "__mocks__/",
        "coverage/"
    ],

    rules: {
        "class-methods-use-this": "off",
        "@typescript-eslint/semi": "off",
        "semi": [ "error" ],
        "no-empty-function": [ "error", { "allow": [ "constructors" ] } ],
    },
    overrides: [{
        files: ["*.spec.ts"], // test files
        rules: {
            "@typescript-eslint/no-floating-promises": "off",
            "dot-notation": "off"
        },
    }],
};
