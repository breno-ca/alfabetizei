import { letterAudioName, normalizeText } from './text'

function publicAssetPath(path) {
  const basePath = import.meta.env.BASE_URL
  return `${basePath}${path}`
}

function audioPath(type, text) {
  const fileName = normalizeText(text).replace(/[^a-z0-9_-]/g, '')
  return publicAssetPath(`audio/${type}/${fileName}.opus`)
}

export function playFile(src) {
  return new Promise((resolve) => {
    const audio = new Audio(src)
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      clearTimeout(fallback)
      resolve()
    }
    const fallback = setTimeout(finish, 1200)

    audio.onended = finish
    audio.onerror = finish
    audio.play().catch(finish)
  })
}

export function playWord(word) {
  return playFile(audioPath('palavras', word))
}

export function playLetter(letter) {
  return playFile(publicAssetPath(`audio/letras/${letterAudioName(letter)}.opus`))
}

export function playSuccess() {
  return playFile(publicAssetPath('audio/efeitos/acerto.opus'))
}
