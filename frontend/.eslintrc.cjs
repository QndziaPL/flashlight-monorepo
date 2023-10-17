module.exports = {
  root: true,
  env: {browser: true, es2020: true},
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:@typescript-eslint/recommended",
    "eslint-config-prettier"
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', "prettier"],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      {allowConstantExport: true},
    ],
    "prettier/prettier": ["error"],
    "react/react-in-jsx-scope": "off",
    "arrow-body-style": ["error", "as-needed"],
    "react-hooks/rules-of-hooks": ["error"],
    "no-unreachable": ["error"],
    "eqeqeq": ["error"],
    "@typescript-eslint/no-explicit-any": "off"
  },
}

