import {defineConfig} from "vite"

export default defineConfig({
  root: ".",
  build: {
    outDir: "./docs",
    emptyOutDir: true, // also necessary
  },
})
