const { colors } = require("tailwindcss/defaultTheme");

module.exports = {
  corePlugins: {
    fontSize: false
  },
  theme: {
    minHeight: {
      "227px": "227px"
    },
    extend: {
      colors: {
        "gray-900-90": "rgba(26, 32, 44, 0.9)",
        "gray-900-60": "rgba(26, 32, 44, 0.6)",
        orange: {
          ...colors.orange,
          "500": "#BF5310"
        },
        gray: {
          ...colors.gray,
          "100": "#F8FAFC"
        }
      }
    }
  },
  variants: {
    borderWidth: ["responsive", "focus"]
  }
};
