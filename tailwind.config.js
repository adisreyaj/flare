module.exports = {
  content: [
    'apps/flare/src/**/*.{ts,html}',
    'libs/ui/**/*.{ts,html}',
    'zigzag/**/*.{ts,html}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-transparent-10': 'var(--primary-transparent-10)',
      },
    },
  },
  plugins: [],
};
