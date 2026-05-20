/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        rose: {
          455: '#f43f5e',
          550: '#e11d48',
          650: '#be123c',
        },
        emerald: {
          650: '#059669',
        },
        blue: {
          650: '#2563eb',
        },
        amber: {
          650: '#d97706',
        },
        red: {
          650: '#dc2626',
        },
        gray: {
          150: '#f1f5f9',
          350: '#cbd5e1',
          450: '#94a3b8',
          550: '#64748b',
          650: '#475569',
          750: '#334155',
        }
      }
    },
  },
  plugins: [],
};
