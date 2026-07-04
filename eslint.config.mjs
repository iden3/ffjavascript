import js from "@eslint/js";
import globals from "globals";

export default [
    { ignores: ["build/", "src/wasm/"] },
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                ...globals.node,
                ...globals.mocha,
            },
        },
        rules: {
            "indent": ["error", 4],
            "linebreak-style": ["error", "unix"],
            "quotes": ["error", "double"],
            "semi": ["error", "always"],
        },
    },
    {
        // `import "ses"` installs these as ambient globals
        files: ["test/ses/**"],
        languageOptions: {
            globals: {
                lockdown: "readonly",
                harden: "readonly",
                Compartment: "readonly",
            },
        },
    },
];
