/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      colors: {
        farm: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        moss: {
          500: '#3d6b4f',
          600: '#2f5540',
        },
      },
      boxShadow: {
        card: '0 4px 24px -4px rgba(15, 118, 110, 0.12), 0 0 0 1px rgba(15, 118, 110, 0.06)',
        'card-dark': '0 4px 24px -4px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(34, 197, 94, 0.12)',
      },
      backgroundImage: {
        'hero-mesh':
          'radial-gradient(at 40% 20%, rgba(34,197,94,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(20,184,166,0.12) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(74,222,128,0.1) 0px, transparent 45%)',
      },
    },
  },
  plugins: [],
};
