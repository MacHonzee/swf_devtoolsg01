module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true,
        jest: true
    },
    parser: require.resolve("babel-eslint"),
    parserOptions: {
        ecmaVersion: 2017,
        ecmaFeatures: {
            jsx: true,
            experimentalObjectRestSpread: true
        },
        sourceType: "module"
    },
    plugins: ["react", "json", "prettier", "uu5"],
    extends: ["eslint:recommended", "plugin:react/recommended", "prettier", "plugin:json/recommended", "plugin:uu5/recommended"],
    rules: {
        "no-const-assign": "warn",
        "no-this-before-super": "warn",
        "no-undef": "warn",
        "no-unreachable": "warn",
        "no-unused-vars": ["warn", { args: "none", ignoreRestSiblings: true }],
        "constructor-super": "warn",
        "valid-typeof": "warn",
        "react/prop-types": 0,
        "react/jsx-closing-bracket-location": "warn",
        "react/jsx-indent-props": ["warn", 2],
        "react/jsx-wrap-multilines": "warn",
        "react/no-direct-mutation-state": "error",
        "react/jsx-no-bind": [
            "warn",
            {
                ignoreRefs: true,
                allowArrowFunctions: false,
                allowBind: false
            }
        ],
        "react/no-deprecated": 0,
        "react/display-name": 0,
        "react/react-in-jsx-scope": 0,
        "no-console": 0,
        "prettier/prettier": "warn"
    }
};
