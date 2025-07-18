// .prettierrc.cjs
/** @type {import("prettier").Config} */
module.exports = {
    plugins: ['prettier-plugin-tailwindcss'],
    printWidth: 100,
    tabWidth: 2,
    semi: true,
    singleQuote: true,
    trailingComma: 'es5',
    bracketSpacing: true,
    arrowParens: 'always',
    endOfLine: 'lf',
    vueIndentScriptAndStyle: true,
};
