import {nextui} from "@nextui-org/react";
/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./node_modules/flowbite-react/**/*.js",
    './src/components/**/*.{js,ts,jsx,tsx}', 
    './src/pages/**/*.{js,ts,jsx,tsx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customText: 'var(--color-custom-text)',
        customBg: 'var(--color-custom-bg)',
        customBorder: 'var(--color-custom-border)',
      }
    },
  },
  darkMode: "class",
  plugins: [
    require("flowbite/plugin"),
    require('@tailwindcss/forms'),
    nextui(),
  ],

}

