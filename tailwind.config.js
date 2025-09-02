/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(220 15% 10%)',
        accent: 'hsl(170 70% 45%)',
        primary: 'hsl(220 70% 50%)',
        surface: 'hsl(220 15% 15%)',
        'text-primary': 'hsl(220 10% 95%)',
        'text-secondary': 'hsl(220 10% 75%)',
        'purple-dark': 'hsl(265 80% 20%)',
        'purple-medium': 'hsl(265 70% 40%)',
        'purple-light': 'hsl(265 60% 60%)',
      },
      borderRadius: {
        'lg': '12px',
        'md': '8px',
        'sm': '4px',
      },
      spacing: {
        'lg': '24px',
        'md': '16px',
        'sm': '8px',
        'xl': '32px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(0 0% 0% / 0.15)',
        'focus': '0 0 0 3px var(--colors-accent)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        'slide-up': 'slideUp 200ms cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}