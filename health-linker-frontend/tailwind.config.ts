import type { Config } from 'tailwindcss'

export default {
  content: [
    // CRITICAL: Ensure this path is correct and includes .tsx files
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <-- MUST be exactly this
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config