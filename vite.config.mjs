import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import fs from 'fs';
import autoprefixer from 'autoprefixer'

export default defineConfig(() => {
  return {
    base: './',
    build: {
      outDir: 'build',
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({}), // add options if needed
        ],
      },
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      force: true,
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: [
        {
          find: 'src/',
          replacement: `${path.resolve(__dirname, 'src')}/`,
        },
      ],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],
    },
    server: {
      https: {
        key: fs.readFileSync(path.resolve(__dirname, 'certs','keyJLN.pem'),'utf8'),
        cert: fs.readFileSync(path.resolve(__dirname, 'certs','cert.pem'),'utf8'),
      },
      host:'192.168.100.44',
      port: 3000,
      proxy: {
        '/token': {
          target: 'https://192.168.100.44:5004',  // URL de tu API backend
          changeOrigin: true,
          secure: false,  // Si usas un certificado auto-firmado, usa secure: false
        },
      },
    },
  }
})
