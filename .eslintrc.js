module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "jquery": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "eol-last": ["error", "always"],
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            // "windows",
            "unix"
        ],
        "no-console":0,
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};