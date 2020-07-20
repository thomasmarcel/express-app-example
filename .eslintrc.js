module.exports = {
  "env": {
    "browser": true,
    "es2020": true,
    "node": true,
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 11,
    "sourceType": "module",
  },
  "plugins": [
    "@typescript-eslint",
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": 1,
    "@typescript-eslint/ban-ts-comment": 1,
    "@typescript-eslint/no-var-requires": 1,
  },
};
