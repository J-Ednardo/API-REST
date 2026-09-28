module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": [
        "airbnb-base"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "class-methods-use-this": "off",
        "linebreak-style": "off",
        "no-param-reassign": "off",
        "camelcase": "off",
        "no-unused-vars": "off",
        "no-console": "off",
        "global-require": "off",
        "import/extensions": "off",
        "consistent-return": "off",
        "import/prefer-default-export": "off",
        "prefer-const": "off",
        "no-restricted-globals": "off",
        "no-return-await": "off",
        "max-len": "off",
        "no-plusplus": "off",
        "no-restricted-syntax": "off",
        "no-await-in-loop": "off",
        "no-underscore-dangle": "off"
    }
};