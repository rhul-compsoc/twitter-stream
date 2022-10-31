const tailwind = require('prettier-plugin-tailwindcss');
const organizeImports = require('prettier-plugin-organize-imports');

const plugins = [
    {
        ...tailwind,
        parsers: {
            ...tailwind.parsers,
            ...Object.keys(organizeImports.parsers).reduce((acc, key) => {
                acc[key] = {
                    ...tailwind.parsers[key],
                    preprocess(code, options) {
                        return organizeImports.parsers[key].preprocess(
                            code,
                            options
                        );
                    }
                };
                return acc;
            }, {})
        }
    }
];

/**
 * @type {import('@types/prettier').Options}
 */
module.exports = {
    plugins,
    trailingComma: 'none',
    bracketSameLine: true,
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    printWidth: 80,
    useTabs: false
};
