import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  base: "/deocalc/",
  plugins: [
    svelte({
      onwarn() {}, // Do Nothing
    }),
  ],
});
