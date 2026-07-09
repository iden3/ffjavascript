import js from "@eslint/js";
import globals from "globals";

export default [
    { ignores: ["build/**"] },
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.node,
                ...globals.browser,
                // vitest globals (enabled via globals:true in vite.config.js)
                describe: "readonly",
                it: "readonly",
                test: "readonly",
                expect: "readonly",
                beforeAll: "readonly",
                afterAll: "readonly",
                beforeEach: "readonly",
                afterEach: "readonly",
                vi: "readonly",
            },
        },
        rules: {
            indent: ["error", 4],
            "linebreak-style": ["warn", "unix"],
            quotes: ["error", "double"],
            semi: ["error", "always"],
        },
    },
    {
        // `import "ses"` installs these as ambient globals
        files: ["test/ses/**"],
        languageOptions: {
            globals: { lockdown: "readonly", harden: "readonly", Compartment: "readonly" },
        },
    },
];
