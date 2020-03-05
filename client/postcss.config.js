const Purgecss = require("@fullhuman/postcss-purgecss");
var tailwindcss = require("tailwindcss");

// see https://tailwindcss.com/docs/controlling-file-size
const purgeCss = new Purgecss({
  content: ["**/*.tsx", "**/*.html", "src/css/tailwind.css"],
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
  whitelist: [
    "bg-orange-700",
    "order-orange-700",
    "bg-blue-800",
    "border-blue-800",
    "bg-blue-600",
    "border-blue-600"
  ]
});

module.exports = {
  plugins: [
    tailwindcss("./tailwind.config.js"),
    require("autoprefixer"),
    ...(process.env.CI === "true" ? [purgeCss] : [])
  ]
};
