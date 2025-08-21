import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    breakpoints: {
      sm: "320px",
      md: "768px",
      lg: "960px",
      xl: "1200px",
    },
    tokens: {
      colors: {
        brand: {
          50: { value: "#e6f2ff" },
          100: { value: "#e6f2ff" },
          200: { value: "#bfdeff" },
          300: { value: "#99caff" },
          // ...
          950: { value: "#001a33" },
        },
        red: { value: "#EE0F0F" },
        text: { value: "white" },
        textSecondary: { value: "#B7C9EF" },
        background: { value: "#1a202c" },
      },
    },
    semanticTokens: {
      colors: {
        danger: { value: "{colors.red}" },
        text: { value: "{colors.text}" },
        textSecondary: { value: "{colors.textSecondary}" },
        background: { value: "{colors.background}" },
      },
    },
    keyframes: {
      spin: {
        from: { transform: "rotate(0deg)" },
        to: { transform: "rotate(360deg)" },
      },
    },
  },
});

const theme = createSystem(defaultConfig, config);
export default theme;
