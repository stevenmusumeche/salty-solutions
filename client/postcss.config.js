const Purgecss = require("@fullhuman/postcss-purgecss");
var tailwindcss = require("tailwindcss");

// see https://tailwindcss.com/docs/controlling-file-size
const purgeCss = new Purgecss({
  content: ["**/*.tsx", "**/*.html"],
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
});

module.exports = {
  plugins: [
    tailwindcss("./tailwind.config.js"),
    require("autoprefixer"),
    ...(process.env.CI === "true" ? [purgeCss] : [])
  ]
};
