module.exports = {
  root: true,
  env: {
    node: true,
    jquery: true,
    browser: true,
    es6: true,
  },
  'extends': [

  ],
  rules: {
    'generator-star-spacing': 'off',
    'no-mixed-spaces-and-tabs': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "no-unused-vars": "off",
    "no-unreachable": "off",
    "indent": "off",
    "no-extra-semi": "off",
    "no-useless-computed-key": "off",
    "no-redeclare": "warn",
    "eslint.autoFixOnSave":"off",
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: 'babel-eslint',
    "ecmaVersion": 7,
    "sourceType": "module"
  },
}
