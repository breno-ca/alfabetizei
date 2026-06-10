#!/usr/bin/env bash

set -euo pipefail

OUTPUT_DIR="public/audio"
LETRAS_DIR="$OUTPUT_DIR/letras"
PALAVRAS_DIR="$OUTPUT_DIR/palavras"
TMP_DIR="$(mktemp -d)"
MODE="${1:-all}"

EDGE_VOICE="pt-BR-FranciscaNeural"
OPUS_BITRATE="16k"

mkdir -p "$LETRAS_DIR" "$PALAVRAS_DIR"
trap 'rm -rf "$TMP_DIR"' EXIT

EDGE_TTS_BIN="$(command -v edge-tts || true)"

if [[ -z "$EDGE_TTS_BIN" ]]; then
  echo "Erro: edge-tts não encontrado no PATH."
  echo "Instale com: pipx install edge-tts"
  exit 1
fi

sanitize_filename() {
  echo "$1" \
    | iconv -f UTF-8 -t ASCII//TRANSLIT \
    | tr '[:upper:]' '[:lower:]' \
    | sed 's/ /_/g' \
    | sed 's/[^a-zA-Z0-9_-]//g'
}

generate_audio() {
  local text="$1"
  local output="$2"
  local mp3_file="$TMP_DIR/temp.mp3"

  "$EDGE_TTS_BIN" \
    --voice "$EDGE_VOICE" \
    --text "$text" \
    --write-media "$mp3_file"

  ffmpeg -nostdin -loglevel quiet -y -i "$mp3_file" -c:a libopus -b:a "$OPUS_BITRATE" "$output"
}

if [[ "$MODE" == "all" || "$MODE" == "letras" ]]; then
  jq -r '.alfabeto[]' palavras.json | while read -r letra; do
    file_name="$(sanitize_filename "$letra")"
    echo "Gerando letra: $letra"
    generate_audio "$letra" "$LETRAS_DIR/${file_name}.opus"
  done
fi

if [[ "$MODE" == "all" || "$MODE" == "acentos" ]]; then
  jq -r '[.grupos, .contextos] | .[] | to_entries[].value[] | explode[] | [.] | implode' palavras.json \
    | sort -u \
    | while read -r letra; do
      case "$letra" in
        "á") file_name="a_agudo"; text="a com acento agudo" ;;
        "â") file_name="a_circunflexo"; text="a com acento circunflexo" ;;
        "ã") file_name="a_til"; text="a com til" ;;
        "é") file_name="e_agudo"; text="e com acento agudo" ;;
        "í") file_name="i_agudo"; text="i com acento agudo" ;;
        "ó") file_name="o_agudo"; text="o com acento agudo" ;;
        "ç") file_name="c_cedilha"; text="cê cedilha" ;;
        *) continue ;;
      esac

      echo "Gerando letra acentuada: $letra"
      generate_audio "$text" "$LETRAS_DIR/${file_name}.opus"
    done
fi

if [[ "$MODE" == "all" || "$MODE" == "palavras" ]]; then
  jq -r '[.grupos, .contextos] | .[] | to_entries[].value[]' palavras.json | sort -u | while read -r palavra; do
    file_name="$(sanitize_filename "$palavra")"
    echo "Gerando palavra: $palavra"
    generate_audio "$palavra" "$PALAVRAS_DIR/${file_name}.opus"
  done
fi

echo "Concluído"
