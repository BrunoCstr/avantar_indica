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
    },
  },
  plugins: [],
}