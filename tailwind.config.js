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
        regular: "FamiljenGrotesk-Regular",
        medium: "FamiljenGrotesk-Medium",
        semiBold: "FamiljenGrotesk-SemiBold",
        bold: "FamiljenGrotesk-Bold"
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