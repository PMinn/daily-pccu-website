import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './contexts/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    darkMode: "class",
    plugins: [heroui({
        themes: {
            light: {
                colors: {
                    primary: {
                        50: "#fffdeb",
                        100: "#fff9c6",
                        200: "#fff288",
                        300: "#ffe64a",
                        400: "#fed621",
                        500: "#f9b810",
                        600: "#dc8b03",
                        700: "#b76306",
                        800: "#944c0c",
                        900: "#7a3f0d",
                        950: "#462002",
                        DEFAULT: "#f9b810",
                        foreground: "#000000",
                    },
                    secondary: {
                        DEFAULT: "#f9b810",
                        foreground: "#000000",
                    },
                }
            },
            dark: {
                colors: {
                    primary: {
                        50: "#fffdeb",
                        100: "#fff9c6",
                        200: "#fff288",
                        300: "#ffe64a",
                        400: "#fed621",
                        500: "#f9b810",
                        600: "#dc8b03",
                        700: "#b76306",
                        800: "#944c0c",
                        900: "#7a3f0d",
                        950: "#462002",
                        DEFAULT: "#f9b810",
                        foreground: "#000000",
                    },
                    secondary: {
                        DEFAULT: "#f9b810",
                        foreground: "#000000",
                    },
                },
            },
        },
    })],
}