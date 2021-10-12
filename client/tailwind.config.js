module.exports = {
  theme: {
    extend: {
      spacing: {
        22: "5.5rem",
        72: "18rem",
        80: "20rem",
        84: "21rem",
        88: "22rem",
        200: "50rem",
      },
      colors: {
        "brand-yellow": {
          default: "#fec657",
        },
        "la-tag": {
          lighter: "#d9e0e7",
        },
      },
    },
  },
  // enabling all variants for all plugins will result in much bigger file sizes, but we have purgecss installed
  variants: [
    "responsive",
    "group-hover",
    "focus-within",
    "first",
    "last",
    "odd",
    "even",
    "hover",
    "focus",
    "active",
    "visited",
    "disabled",
  ],

  plugins: [],
};
