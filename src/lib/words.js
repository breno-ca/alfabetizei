import dataset from '../../palavras.json'

export const words = [...new Set([...Object.values(dataset.grupos).flat(), ...Object.values(dataset.contextos).flat()])]

export function getRandomWord(currentWord) {
  const options = words.filter((word) => word !== currentWord)
  return options[Math.floor(Math.random() * options.length)]
}
