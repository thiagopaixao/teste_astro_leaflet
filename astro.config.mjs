import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  site: 'https://thiagopaixao.github.io',
  base: '/teste_astro_stelvia',
  integrations: [tailwind(), svelte()]
});
