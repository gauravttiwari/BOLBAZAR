/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#059669',
          dark: '#047857',
          light: '#10b981',
        },
        secondary: {
          DEFAULT: '#d97706',
          dark: '#b45309',
          light: '#f59e0b',
        },
        accent: {
          green: '#059669',
          red: '#dc2626',
          orange: '#ea580c',
        },
        surface: {
          DEFAULT: '#f0fdf4',
          card: '#ffffff',
          dark: '#1f2937',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 4px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.12)',
        'nav': '0 2px 4px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
}