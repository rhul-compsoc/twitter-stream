const organizeImports = require('prettier-plugin-organize-imports');
/**
 * @type {import('@types/prettier').Plugin}
 */
const tailwind = require('prettier-plugin-tailwindcss');
/**
 * @type {import('@types/prettier').Plugin}
 */
const prisma = require('prettier-plugin-prisma');

const plugins = [
    prisma,
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
 * @type {import('@types/prettier').Config}
 */
module.exports = {
    plugins,
    trailingComma: 'none',
    bracketSameLine: false,
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    printWidth: 80,
    useTabs: false,
    overrides: [
        {
            files: '*.prisma',
            options: { parser: 'prisma-parse' }
        }
    ]
};
