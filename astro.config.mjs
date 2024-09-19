import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  site: 'http://localhost:4321',
  base: '',
  integrations: [tailwind(), svelte()],
  build: {
    assets: 'astro'
  }
});
