# Alfabetizei

## Objetivo

Projeto educativo simples para prática de alfabetização e digitação em português do Brasil.

A criança ou adulto vê uma palavra, ouve a palavra/letras e digita a palavra correta. A interface deve permanecer mínima, centralizada e sem fluxos complexos.

## Escopo Atual

- Frontend estático com Vite + React.
- Idioma base: `pt-BR`.
- Palavra inicial fixa: `alfabeto`.
- Após completar uma palavra, o app toca um som positivo, repete a palavra e sorteia a próxima.
- Palavras vêm de `palavras.json`.
- Áudios são arquivos estáticos em `public/audio`.
- Não depende de TTS do navegador em runtime.
- Não depende de backend.

## Experiência Da Tela

- Topo: instrução curta `leia, ouça, digite`.
- Centro: palavra em caixa alta.
- Abaixo: mesma palavra com aparência cursiva.
- Ao lado direito: botão retangular `ouvir palavra`.
- Rodapé: espaços monoespaçados para digitação.
- Letra correta digitada acende o espaço correspondente imediatamente.
- A letra aparece junto com seu áudio quando chegar sua vez na fila.
- A letra apresentada deve ser destacada nas duas palavras visíveis: caixa alta e cursiva.
- Som da letra entra em uma fila curta com intervalo entre letras.
- Erro de digitação não mostra feedback visual ou sonoro.

## Fluxo De Digitação

- O usuário só avança se digitar a letra correta da posição atual.
- Acentos são normalizados na entrada.
- Exemplo: para `sofá`, digitar `a` aceita e revela `á`.
- Backspace remove a última letra aceita.
- Áudio nunca deve bloquear a digitação.
- Se um áudio falhar, o exercício deve continuar.
- Se o usuário digitar rápido, os espaços corretos acendem imediatamente, mas as letras aparecem em sequência com seus áudios.
- A conclusão da palavra só deve acontecer depois que a fila de áudio das letras terminar.

## Fluxo De Conclusão

Ao completar a palavra:

1. Tocar `public/audio/efeitos/acerto.opus`.
2. Tocar o áudio da palavra completa.
3. Sortear uma nova palavra diferente da atual.
4. Resetar digitação.

## Áudio

Formato escolhido:

- Codec/container: `.opus`.
- Motivo: leve, bom para internet, boa qualidade em baixo bitrate.

Estrutura:

```text
public/audio/
  letras/
    a.opus
    b.opus
    ...
  palavras/
    alfabeto.opus
    casa.opus
    ...
  efeitos/
    acerto.opus
```

Geração:

- Script: `gerar.sh`.
- Fonte atual da voz: `edge-tts`.
- Voz atual: `pt-BR-FranciscaNeural`.
- O app usa apenas os arquivos gerados; não chama TTS online.

## Dataset

Arquivo base: `palavras.json`.

Contém:

- `alfabeto`: letras de `a` a `z`.
- `grupos`: palavras por quantidade aproximada de sílabas.
- `contextos`: palavras por ambiente/categoria.

Diretriz para novas palavras:

- Priorizar cotidiano.
- Priorizar palavras úteis para alfabetização.
- Incluir objetos próximos ao usuário: casa, cozinha, quarto, sala, mesa, computador.
- Evitar palavras ofensivas, adultas ou ambíguas para público infantil.

## Comandos

Instalar dependências do frontend:

```bash
npm install
```

Rodar local:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Gerar áudios:

```bash
./gerar.sh
```

Gerar apenas letras acentuadas detectadas no JSON:

```bash
./gerar.sh acentos
```

## Estrutura Técnica

```text
src/
  main.jsx
  App.jsx
  components/
    TypingSlots.jsx
    WordDisplay.jsx
  lib/
    audio.js
    text.js
    words.js
  style.css
```

- `main.jsx`: entrada React.
- `App.jsx`: orquestra estado do exercício e fluxo de digitação/áudio.
- `components/`: componentes visuais sem regra de negócio pesada.
- `lib/audio.js`: caminhos e reprodução dos arquivos de áudio.
- `lib/text.js`: normalização de texto e nomes de áudio de letras acentuadas.
- `lib/words.js`: leitura do dataset e sorteio de palavras.

## Hospedagem

- Pode ser hospedado como site estático.
- GitHub Pages é suficiente.
- `node_modules` não entra no deploy.
- `public/audio` é copiado para `dist/audio`.
- `dist/` não deve ser versionado; é gerado pelo build.
- O workflow `.github/workflows/pages.yml` publica o `dist/` automaticamente no GitHub Pages.
- `vite.config.js` usa `BASE_PATH` para funcionar em subpath de repositório.

Build local simulando GitHub Pages para repositório `alfabetizei`:

```bash
npm run build:pages
```

No GitHub, habilite Pages em:

```text
Settings -> Pages -> Build and deployment -> Source: GitHub Actions
```

## Restrições De Implementação

- Manter código mínimo enquanto o produto ainda está sendo refinado.
- Evitar arquitetura pesada antes da necessidade real.
- Preferir dados simples em JSON.
- Preferir áudio estático em vez de TTS no navegador.
- Não adicionar dependências sem necessidade clara.
- Interface deve continuar simples e centrada.

## Estado Atual Conhecido

- Áudios gerados: 26 letras, 104 palavras.
- Tamanho aproximado de `public/audio`: `540K`.
- Build validado com `npm run build`.
