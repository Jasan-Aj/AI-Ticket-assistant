import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server:{
    '/api': 'https://ai-ticket-assistant-4qfw.vercel.app'
  },
  plugins: [react(), tailwindcss()],
})
