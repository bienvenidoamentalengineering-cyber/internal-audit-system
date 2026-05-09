import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta: Negro mate + Azul profundo
        'dark': '#0A0E27',      // Negro mate
        'darker': '#050810',    // Negro más oscuro
        'primary': '#1C3A5E',   // Azul profundo
        'primary-light': '#2A5A8E', // Azul más claro
        'accent': '#3B82F6',    // Azul brillante para CTAs
        'muted': '#6B7280',     // Gris para texto secundario
        'border': '#1F2937',    // Gris oscuro para bordes
      },
      fontFamily: {
        'serif': ['Georgia', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
