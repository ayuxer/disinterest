import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./client/index.html", "./client/**/*.{html,vue,css}"],
  theme: {
    fontFamily: {
      sans: ["Work Sans", ...defaultTheme.fontFamily.sans],
      serif: ["Work Sans", ...defaultTheme.fontFamily.sans],
      playful: ["Pacifico", ...defaultTheme.fontFamily.sans],
    },
    extend: {
      colors: {
        "main-background": "var(--colors-main-background)",
        "background-alt": "var(--colors-background-alt)",
        "main-foreground": "var(--colors-main-foreground)",
        "foreground-alt": "var(--colors-foreground-alt)",
        accent: "var(--colors-accent)",
      },
    },
  },
  plugins: [],
};
