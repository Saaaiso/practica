import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  
  plugins: [react()],
  server: {
    proxy: {
      '/Tickets': {
        target: 'https://localhost:8080 ', // порт твоего ASP.NET API
        changeOrigin: true,
        secure: false, // если сертификат dev самоподписанный
      },
    },
  },
})