<h1 align="center">SVG to TypeScript</h1>

<p align="center">
  <a href="https://react.dev/"><img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=000" /></a>
  <a href="https://www.typescriptlang.org/"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=fff" /></a>
  <a href="https://vite.dev/"><img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=fff" /></a>
  <a href="https://tailwindcss.com/"><img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=fff" /></a>
  <a href="https://vercel.com/"><img alt="Deploy" src="https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel&logoColor=fff" /></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-green" /></a>
</p>

<p align="center">
  <a href="https://svgtotsx.adrielgama.dev"><strong>Acessar aplicação:</strong> https://svgtotsx.adrielgama.dev</a>
</p>

Ferramenta web para converter SVG em componentes React com TypeScript. O app roda inteiramente no navegador, sem backend, e foi criado para facilitar a transformação de ícones, logos e ilustrações SVG em TSX reutilizável.

## Funcionalidades

- Conversão automática de SVG para componente React TypeScript.
- Campo para definir o nome do componente.
- Suporte a diferentes formatos de exportação:
  - `export default function NomeIcon(...)`
  - `const NomeIcon = (...) => (...)` com `export default NomeIcon`
  - `export const NomeIcon = (...) => (...)`
- Opção para substituir cores por `currentColor`.
- Opções para incluir ou remover `className` e `{...props}`.
- Conversão de atributos SVG para JSX, como `stroke-width` para `strokeWidth`.
- Remoção de comentários do SVG.
- Preservação de `viewBox` e elementos internos como `path`, `circle`, `rect`, `g`, `defs` e `clipPath`.
- Botão para copiar o componente gerado.
- Botão para limpar a entrada.
- Botão para formatar o SVG colado.
- Preview recolhido do SVG com tamanho controlado.
- Persistência do último SVG no `localStorage`.
- Tema claro/escuro com preferência inicial pelo tema do sistema.

## Como Rodar Localmente

Requisitos:

- Node.js 20 ou superior
- pnpm

Instale as dependências:

```bash
pnpm install
```

Rode o ambiente de desenvolvimento:

```bash
pnpm dev
```

Gere o build de produção:

```bash
pnpm build
```

Execute o lint:

```bash
pnpm lint
```

## Estrutura Principal

```txt
src/
  App.tsx                  Interface principal da aplicação
  lib/
    svg-to-tsx.ts          Conversão e formatação de SVG
    utils.ts               Utilitário cn() para classes Tailwind
  components/
    theme-provider.tsx     Provider de tema
    ui/                    Componentes no padrão shadcn/ui
public/
  robots.txt
  sitemap.xml
  og-image.png
```

## Conversão

A lógica principal fica em [`src/lib/svg-to-tsx.ts`](src/lib/svg-to-tsx.ts). Ela usa `DOMParser` no client para validar e percorrer o SVG, convertendo atributos para JSX e gerando o componente TSX conforme as opções selecionadas.

Exemplo de saída:

```tsx
export default function BellIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
```

## Contribuindo

Contribuições são bem-vindas.

Antes de abrir um pull request:

1. Rode `pnpm lint`.
2. Rode `pnpm build`.
3. Mantenha as mudanças focadas no problema que o PR resolve.
4. Evite refatorações grandes junto de correções pequenas.
5. Quando alterar a conversão, inclua exemplos manuais ou testes futuros que cubram o comportamento.

Boas áreas para contribuição:

- Melhorar cobertura de atributos SVG menos comuns.
- Adicionar testes automatizados para o conversor.
- Melhorar o formatador de SVG.
- Criar presets para componentes de ícones.
- Melhorar acessibilidade e mensagens de erro.

## Donate

Se este projeto te ajudou, considere apoiar o desenvolvimento:

<p>
  <a href="https://ko-fi.com/adrielgama">
    <img alt="Apoiar no Ko-fi" src="https://img.shields.io/badge/Apoiar-Ko--fi-ff5f5f?logo=kofi&logoColor=fff" />
  </a>
</p>

## SEO e Deploy

O projeto já possui metadados básicos em `index.html`, além de `robots.txt`, `sitemap.xml` e imagem Open Graph em `public/og-image.png`.

Se o domínio final mudar, atualize:

- `index.html`
- `public/sitemap.xml`

## Autor

Desenvolvido por [Adriel Gama](https://adrielgama.dev).

## Licença

Distribuído sob a licença MIT. Consulte [`LICENSE`](LICENSE) para mais detalhes.
