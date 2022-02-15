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
      aspectRatio: {
        header: '24 / 9',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
