import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  build:{
    target:"esnext",
    rollupOptions:{
      input:{
        popup: "./popup.html",
        background: "./src/background/main.ts",
        content: "./src/content/main.ts",
      },
      output:{
        entryFileNames: "[name].js"
      }
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'src/content/content.css', // Caminho do CSS no projeto
          dest: 'assets', // Caminho onde será gerado em `dist`
        },
      ],
    }),
  ],
  base: "./"
});