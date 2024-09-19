import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";
import { execSync } from 'child_process';

function getRepoName() {
  const remoteUrl = execSync('git config --get remote.origin.url').toString().trim();
  const match = remoteUrl.match(/(?:github\.com|gitlab\.com)[/:](.+?)\/(.+?)(?:\.git)?$/);
  if (match) {
    return match[2]; // Nome do repositório
  }
  throw new Error('Não foi possível obter o nome do repositório.');
}

const BASE_PATH = `/${getRepoName()}`;

// https://astro.build/config
export default defineConfig({
  site: 'https://thiagopaixao.github.io',
  base: BASE_PATH,
  integrations: [tailwind(), svelte()],
  build: {
    assets: 'astro'
  }
});
