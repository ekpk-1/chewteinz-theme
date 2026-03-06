/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layout/**/*.liquid',
    './sections/**/*.liquid',
    './snippets/**/*.liquid',
    './templates/**/*.liquid',
    './templates/**/*.json',
    './assets/*.js',
  ],
  theme: {
    extend: {
      colors: {
        'chewteinz-yellow': '#FFE55C',
        'chewteinz-blue': '#A8D8FF',
        'chewteinz-pink': '#FFB3E6',
        'chewteinz-purple': '#C8A2F0',
        'chewteinz-orange': '#FFB380',
      },
      zIndex: {
        '60': '60',
      },
      fontFamily: {
        'display': ['"Fredoka"', 'system-ui', 'sans-serif'],
        'body': ['"Nunito"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce-slow 3s infinite',
        'float': 'float 6s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'slide-left': 'slide-left 30s linear infinite',
      },
      keyframes: {
        'bounce-slow': {
          '0%, 100%': {
            transform: 'translateY(-20%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
