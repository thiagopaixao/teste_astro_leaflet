import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/teste_astro_leaflet' : '';

// https://astro.build/config
export default defineConfig({
  site: 'https://thiagopaixao.github.io',
  base: BASE_PATH,
  integrations: [tailwind(), svelte()],
  build: {
    assets: 'astro'
  }
});
