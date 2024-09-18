**Projeto: Desenvolvimento de um Site One Page com Astro, Decap CMS, Tailwind, Leaflet e Geoman**

---

**Descrição do Projeto:**

Você é um desenvolvedor experiente encarregado de criar um site one page interativo que apresenta um Story Map. O site deve ser construído usando as seguintes tecnologias:

- **Astro**: Framework estático para construção de sites rápidos.
- **Decap CMS**: Sistema de gerenciamento de conteúdo para edição dinâmica de conteúdo.
- **Tailwind CSS**: Framework CSS utilitário para estilização rápida e responsiva.
- **Leaflet**: Biblioteca JavaScript para mapas interativos.
- **Geoman**: Plugin para Leaflet que permite edição e desenho de geometria no mapa.

---

**Objetivos Principais:**

1. **Criar um site one page** que contenha as seguintes seções:

   - **Cabeçalho com imagem**
   - **Texto descritivo**
   - **Galeria de imagens**
   - **Mapa interativo com scrolldown**
   - **Rodapé**

2. **Implementar conteúdo dinâmico**, permitindo que o usuário (administrador) escolha a ordem e a quantidade de cada seção para compor o site, através do Decap CMS.

3. **Integrar o Geoman ao Leaflet**, permitindo que os usuários finais possam desenhar, criar layers e adicionar geometria no mapa interativo.

---

**Instruções e Tarefas Passo a Passo:**

### **1. Configuração do Ambiente de Desenvolvimento**

- **1.1.** Certifique-se de ter o **Node.js** e o **npm** instalados na sua máquina.
- **1.2.** Inicie um novo projeto Astro:
  ```bash
  npm create astro@latest my-story-map
  ```
- **1.3.** Navegue até o diretório do projeto:
  ```bash
  cd my-story-map
  ```
- **1.4.** Instale as dependências necessárias:
  ```bash
  npm install
  ```

### **2. Configuração do Tailwind CSS**

- **2.1.** Instale o Tailwind CSS e suas dependências:
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  ```
- **2.2.** Inicie o Tailwind CSS:
  ```bash
  npx tailwindcss init -p
  ```
- **2.3.** Configure o arquivo `tailwind.config.js` para incluir os arquivos Astro:
  ```javascript
  module.exports = {
    content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  ```
- **2.4.** Adicione as diretivas do Tailwind no arquivo `src/styles/global.css`:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- **2.5.** Importe o arquivo de estilos globais no seu projeto Astro, geralmente no `src/layouts/Layout.astro` ou equivalente:
  ```html
  <link rel="stylesheet" href="/styles/global.css" />
  ```

### **3. Configuração do Decap CMS**

- **3.1.** Crie uma pasta `public/admin` e adicione o arquivo `index.html` com o código básico de inicialização do Decap CMS.
- **3.2.** Instale o Decap CMS:
  ```bash
  npm install netlify-cms-app
  ```
- **3.3.** Configure o arquivo `public/admin/config.yml` para definir as coleções e campos necessários:
  ```yaml
  backend:
    name: git-gateway
    branch: main

  media_folder: "public/uploads"
  public_folder: "/uploads"

  collections:
    - name: "sections"
      label: "Seções"
      folder: "src/content/sections"
      create: true
      slug: "{{uuid}}"
      fields:
        - { label: "Tipo de Seção", name: "type", widget: "select", options: ["header", "text", "gallery", "map", "footer"] }
        - { label: "Conteúdo", name: "content", widget: "markdown" }
        - { label: "Imagens", name: "images", widget: "list", field: { label: "Imagem", name: "image", widget: "image" }, required: false }
        - { label: "Ordem", name: "order", widget: "number" }
  ```
- **3.4.** Certifique-se de que a pasta `src/content/sections` existe.

### **4. Desenvolvimento das Seções Dinâmicas**

- **4.1.** **Criar o Esquema de Conteúdo no Astro:**

  - Crie o arquivo `src/content/config.ts`:
    ```typescript
    import { z, defineCollection } from 'astro:content';

    const sectionsCollection = defineCollection({
      schema: z.object({
        type: z.enum(["header", "text", "gallery", "map", "footer"]),
        content: z.string().optional(),
        images: z.array(z.string()).optional(),
        order: z.number(),
      }),
    });

    export const collections = {
      sections: sectionsCollection,
    };
    ```

- **4.2.** **Criar Componentes para Cada Tipo de Seção:**

  - **Header Component (`src/components/sections/Header.astro`):**
    ```astro
    ---
    const { content } = Astro.props;
    ---
    <header class="bg-cover bg-center h-screen" style={`background-image: url('${content}')`}>
      <!-- Conteúdo adicional se necessário -->
    </header>
    ```

  - **Text Component (`src/components/sections/TextSection.astro`):**
    ```astro
    ---
    const { content } = Astro.props;
    ---
    <section class="py-8">
      <div class="container mx-auto">
        <div class="prose">
          {content}
        </div>
      </div>
    </section>
    ```

  - **Gallery Component (`src/components/sections/Gallery.astro`):**
    ```astro
    ---
    const { images } = Astro.props;
    ---
    <section class="py-8">
      <div class="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {images.map((image) => (
          <img src={image} alt="Gallery Image" class="w-full h-auto" />
        ))}
      </div>
    </section>
    ```

  - **Map Component (`src/components/sections/MapSection.astro`):**
    ```astro
    ---
    import { onMount } from 'solid-js';

    onMount(() => {
      const map = L.map('map').setView([0, 0], 2);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // Integrar Geoman
      map.pm.addControls({
        position: 'topleft',
        drawCircle: false,
      });
    });
    ---
    <section class="h-screen">
      <div id="map" class="w-full h-full"></div>
    </section>
    ```

    - **Nota:** Certifique-se de incluir os scripts e estilos do Leaflet e Geoman no projeto.

  - **Footer Component (`src/components/sections/Footer.astro`):**
    ```astro
    ---
    const { content } = Astro.props;
    ---
    <footer class="bg-gray-800 text-white py-4">
      <div class="container mx-auto text-center">
        {content}
      </div>
    </footer>
    ```

### **5. Montagem da Página Principal com Seções Dinâmicas**

- **5.1.** **Crie o arquivo `src/pages/index.astro`:**
  ```astro
  ---
  import { getCollection } from 'astro:content';
  import Header from '../components/sections/Header.astro';
  import TextSection from '../components/sections/TextSection.astro';
  import Gallery from '../components/sections/Gallery.astro';
  import MapSection from '../components/sections/MapSection.astro';
  import Footer from '../components/sections/Footer.astro';

  const sections = await getCollection('sections');
  const sortedSections = sections.sort((a, b) => a.data.order - b.data.order);
  ---
  <Layout>
    {sortedSections.map((section) => {
      switch (section.data.type) {
        case 'header':
          return <Header content={section.data.content} />;
        case 'text':
          return <TextSection content={section.data.content} />;
        case 'gallery':
          return <Gallery images={section.data.images} />;
        case 'map':
          return <MapSection />;
        case 'footer':
          return <Footer content={section.data.content} />;
        default:
          return null;
      }
    })}
  </Layout>
  ```

### **6. Integração do Leaflet e Geoman**

- **6.1.** **Instale o Leaflet:**
  ```bash
  npm install leaflet
  ```
- **6.2.** **Adicione os estilos do Leaflet no arquivo global ou no componente do mapa:**
  ```html
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
    integrity="sha256-xwE/8qWdQ6TQ/ux4RV6V6iqj/c1h9fVDT9GCDaqgQ3s="
    crossorigin=""
  />
  ```
- **6.3.** **Adicione os scripts do Leaflet e Geoman:**
  ```html
  <script
    src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
    integrity="sha256-d2R52j1BZGqsFey5R6SsoGwCoxBie4q6bl2Y7DW4p6Y="
    crossorigin=""
  ></script>
  <script src="https://unpkg.com/@geoman-io/leaflet-geoman-free@2.11.4/dist/leaflet-geoman.min.js"></script>
  ```
- **6.4.** **Adicione os estilos do Geoman:**
  ```html
  <link
    rel="stylesheet"
    href="https://unpkg.com/@geoman-io/leaflet-geoman-free@2.11.4/dist/leaflet-geoman.css"
  />
  ```

### **7. Personalização e Responsividade**

- **7.1.** **Ajuste os componentes e estilos conforme necessário para garantir uma boa experiência em dispositivos móveis e desktops.**
- **7.2.** **Utilize as classes utilitárias do Tailwind CSS para estilização rápida.**

### **8. Testes e Depuração**

- **8.1.** **Inicie o servidor de desenvolvimento:**
  ```bash
  npm run dev
  ```
- **8.2.** **Acesse o site no navegador e teste todas as seções, garantindo que elas apareçam na ordem definida no Decap CMS.**
- **8.3.** **Teste a funcionalidade do mapa interativo, incluindo as ferramentas do Geoman.**

### **9. Implantação**

- **9.1.** **Configure o site para implantação estática ou escolha um serviço compatível com o Astro.**
- **9.2.** **Realize o build de produção:**
  ```bash
  npm run build
  ```
- **9.3.** **Implante os arquivos gerados na pasta `dist` no seu serviço de hospedagem preferido.**

---

**Considerações Finais:**

- **Modularidade:** Certifique-se de que os componentes estão bem organizados e que o código é modular para facilitar futuras manutenções ou expansões.
- **Acessibilidade:** Garanta que o site seja acessível, seguindo as melhores práticas de desenvolvimento web.
- **Documentação:** Documente o código e as funcionalidades implementadas para facilitar a compreensão por outros desenvolvedores ou usuários.

---

**Recursos Adicionais:**

- **Astro Documentation:** [https://docs.astro.build/](https://docs.astro.build/)
- **Decap CMS Documentation:** [https://decapcms.org/docs/intro/](https://decapcms.org/docs/intro/)
- **Tailwind CSS Documentation:** [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Leaflet Documentation:** [https://leafletjs.com/](https://leafletjs.com/)
- **Geoman Documentation:** [https://geoman.io/leaflet-geoman](https://geoman.io/leaflet-geoman)

---

**Checklist de Tarefas:**

- [x] Configurar o ambiente de desenvolvimento.
- [x] Instalar e configurar o Tailwind CSS.
- [x] Configurar o Decap CMS com a coleção e campos necessários.
- [x] Criar os componentes para cada tipo de seção.
- [x] Implementar a lógica para renderizar as seções dinamicamente.
- [x] Integrar o Leaflet e o Geoman para o mapa interativo.
- [ ] Garantir a responsividade e estilização adequada.
- [ ] Testar todas as funcionalidades do site.
- [ ] Realizar o build de produção e implantar o site.
- [ ] Documentar o projeto e o código desenvolvido.

---

**Objetivo Final:**

Entregar um site one page totalmente funcional e dinâmico, onde o administrador pode definir a ordem e a quantidade das seções através do Decap CMS, e os usuários finais podem interagir com um mapa dinâmico e editar geometrias usando o Geoman.

---

**Nota:**

Este projeto requer conhecimentos em desenvolvimento web moderno, incluindo frameworks estáticos, gerenciamento de conteúdo, estilização com CSS utilitário e manipulação de mapas interativos. Certifique-se de seguir as melhores práticas e consultar a documentação oficial das tecnologias utilizadas quando necessário.
