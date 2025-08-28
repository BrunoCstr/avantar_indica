import { colors } from './src/styles/colors'

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./src/**/*.{js,jsx,ts,tsx}","./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ['FamiljenGrotesk-Regular', 'system-ui', 'sans-serif'],
        regular: ['FamiljenGrotesk-Regular', 'system-ui', 'sans-serif'],
        medium: ['FamiljenGrotesk-Medium', 'system-ui', 'sans-serif'],
        semibold: ['FamiljenGrotesk-SemiBold', 'system-ui', 'sans-serif'],
        bold: ['FamiljenGrotesk-Bold', 'system-ui', 'sans-serif'],
        italic: ['FamiljenGrotesk-Italic', 'system-ui', 'sans-serif'],
        'medium-italic': ['FamiljenGrotesk-MediumItalic', 'system-ui', 'sans-serif'],
        'semibold-italic': ['FamiljenGrotesk-SemiBoldItalic', 'system-ui', 'sans-serif'],
        'bold-italic': ['FamiljenGrotesk-BoldItalic', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        ss: '12px',
        s: '16px',
        m: '24px',
        l: '32px',
        xl: "48px"
      },
      spacing: {
        '30': '120px',
        '32': '128px',
        '40': '160px',
        '48': '192px',
        '56': '224px',
        '64': '256px',
      }
    },
  },
  plugins: [],
}