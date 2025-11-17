import expo from "eslint-config-expo/flat.js";

const config = [
  ...expo,
  {
    ignores: ["node_modules/**", "dist/**", "android/**", "ios/**"],
    rules: {
      "react-native/no-inline-styles": "off",
    },
  },
];

export default config;
