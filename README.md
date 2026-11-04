# Portfólio — Guilherme dos Santos Bueno

Site estático, sem dependências e sem etapa de build: HTML + CSS + JavaScript puro.

## Estrutura

```
index.html            página única (todas as seções)
assets/css/style.css  design system (tokens em :root) e layout responsivo
assets/js/main.js     menu mobile, animações de entrada, scroll-spy, copiar e-mail
Guilherme_Santos_Bueno_Curriculo.pdf  (botão "Baixar currículo")
assets/img/  retrato em WebP/JPG (480 e 720 px)
favicon.svg  og-image.png  robots.txt  sitemap.xml  404.html  .nojekyll
```

## Publicar no GitHub Pages

1. Crie um repositório **público** chamado exatamente `euguisantosdev.github.io`.
2. Envie o conteúdo desta pasta para a raiz do repositório (branch `main`).
3. Em *Settings → Pages*, escolha *Deploy from a branch → main → / (root)*.
4. Em ~1 min o site fica em `https://euguisantosdev.github.io/`.

Se usar outro domínio, troque a URL em `index.html` (canonical, `og:url`, `og:image`, JSON-LD), `sitemap.xml` e `robots.txt`.

## Editar conteúdo

- **Níveis de habilidade:** na seção Stack, troque a classe do chip: `lv-pro` (uso profissional), `lv-study` (estudado / projeto próprio), `lv-grow` (em desenvolvimento).
- **Selo "Aberto a oportunidades":** remova o `<p class="status-pill">` do hero quando não se aplicar.
- **Currículo:** substitua o PDF mantendo o mesmo nome de arquivo.
- **Indicadores:** seção `#resultados` em `index.html` (valores em `data-to` e `--v`) e selos `tl-kpi` na linha do tempo.
- **Foto:** troque os arquivos em `assets/img/` mantendo os nomes (ou ajuste o `<picture>` do hero).
- **Cores:** variáveis no topo de `style.css`.
- **Testar localmente:** `python3 -m http.server 8000` e abra `http://localhost:8000`.

## Observações

- Projetos demonstrativos usam dados simulados e estão rotulados como tal.
- Fontes (Space Grotesk, Inter, JetBrains Mono) vêm do Google Fonts, com fallback para fontes do sistema.
