module.exports = {
  useTabs: false,
  printWidth: 120,
  tabWidth: 2,
  trailingComma: "es5",
  endOfLine: "auto",
  jsxBracketSameLine: false,
  semi: true,
  trailingComma: "es5",
  overrides: [
    {
      files: "*.md",
      options: {
        tabWidth: 4,
      },
    },
    {
      files: "*.json",
      options: {
        tabWidth: 4,
        "quote-props": "as-needed",
      },
    },
    {
      files: "*.styl",
      options: {
        tabWidth: 4,
        useTabs: true,
      },
    },
    {
      files: "*.html",
      options: {
        printWidth: 200,
      },
    },
  ],
};
