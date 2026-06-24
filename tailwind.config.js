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
        // Brand palette
        'chewteinz-yellow': '#E6C56F',
        'chewteinz-blue':   '#9FACDA',
        'chewteinz-pink':   '#E3A39A',
        'chewteinz-purple': '#7585BE',
        'chewteinz-orange': '#C98E4F',
        'chewteinz-green':  '#82A56B',

        // Saturated variants for cream surfaces
        'chewteinz-yellow-deep': '#C98E4F',
        'chewteinz-blue-deep':   '#53609A',
        'chewteinz-pink-deep':   '#C77F76',
        'chewteinz-purple-deep': '#5F6DA3',
        'chewteinz-orange-deep': '#A06E37',

        // Surface / ink (mirrors prototype tokens.css)
        'chewteinz-cream':    '#F5EEE0',
        'chewteinz-cream-2':  '#FCFAF7',
        'chewteinz-cream-3':  '#E7DCC4',
        'chewteinz-ink':      '#3A332C',
        'chewteinz-ink-soft': '#5C5248',
        'chewteinz-ink-mute': '#9A8F82',
      },
      fontFamily: {
        'display': ['"Fredoka"', 'system-ui', 'sans-serif'],
        'body':    ['"Nunito"', 'system-ui', 'sans-serif'],
        'mono':    ['ui-monospace', '"SF Mono"', 'Menlo', 'Consolas', 'monospace'],
      },
      maxWidth: {
        'container': '1200px',
        'narrow':    '880px',
      },
      borderRadius: {
        'pill': '999px',
      },
      transitionTimingFunction: {
        'out-expo':   'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-quint': 'cubic-bezier(0.65, 0, 0.35, 1)',
        'spring':     'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      zIndex: {
        '60': '60',
        '70': '70',
      },
      animation: {
        'bounce-slow':  'bounce-slow 3s infinite',
        'float':        'float 6s ease-in-out infinite',
        'sparkle':      'sparkle 1.5s ease-in-out infinite',
        'slide-left':   'slide-left 30s linear infinite',
        'marquee':      'marquee-slide 38s linear infinite',
        'hero-bob':     'hero-bob 6s cubic-bezier(0.65, 0, 0.35, 1) infinite',
        'candy-float':  'candy-float var(--candy-dur, 6s) cubic-bezier(0.65, 0, 0.35, 1) infinite',
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
          '50%':      { transform: 'translateY(-20px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0)' },
          '50%':      { opacity: '1', transform: 'scale(1)' },
        },
        'slide-left': {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-slide': {
          'from': { transform: 'translateX(0)' },
          'to':   { transform: 'translateX(-50%)' },
        },
        'hero-bob': {
          '0%, 100%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%':      { transform: 'translateY(-14px) rotate(2deg)' },
        },
        'candy-float': {
          '0%, 100%': { transform: 'translateY(0) rotate(var(--candy-rot, 0deg))' },
          '50%':      { transform: 'translateY(-14px) rotate(var(--candy-rot, 0deg))' },
        },
      },
    },
  },
  plugins: [],
};
