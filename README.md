# Alfabetizei

Projeto educativo para praticar alfabetização e digitação em português do Brasil.

A pessoa vê uma palavra em caixa alta e cursiva, ouve seus sons e digita letra por letra na ordem correta.

## Funcionalidades

- Palavra inicial fixa: `alfabeto`.
- Sorteio de nova palavra ao concluir a atual.
- Destaque sincronizado da letra em caixa alta e cursiva.
- Digitação guiada: só a letra correta da posição atual é aceita.
- Áudios estáticos em `.opus`; o app não depende de TTS do navegador.
- Deploy como site estático.

## Desenvolvimento

```bash
npm install
npm run dev
```

```bash
npm run build
```

## Áudios

```text
public/audio/
  letras/
  palavras/
  efeitos/
```

Os áudios são arquivos estáticos gerados para fins educacionais e podem ser substituídos quando necessário.

```bash
./gerar.sh
./gerar.sh acentos
```

O script espera `edge-tts`, `ffmpeg`, `jq` e `iconv` disponíveis no ambiente. As palavras ficam em `palavras.json`.

## Deploy

O projeto inclui workflow para GitHub Pages. No repositório, habilite:

```text
Settings -> Pages -> Build and deployment -> Source: GitHub Actions
```

Para testar o build com base de Pages:

```bash
npm run build:pages
```

## Licença

Código sob licença MIT. Veja `LICENSE`.

Os áudios do projeto são conteúdo estático educacional e podem ser substituídos/regenerados.
