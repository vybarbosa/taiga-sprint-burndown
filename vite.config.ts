import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  build:{
    target:"esnext",
    rollupOptions:{
      input:{
        popup: "./popup.html",
        background: "./src/modules/background/index.ts",
        content: "./src/modules/content/index.ts",
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
          src: 'src/modules/content/index.css', // Caminho do CSS no projeto
          dest: 'assets', // Caminho onde será gerado em `dist`
        },
      ],
    }),
  ],
  base: "./"
});