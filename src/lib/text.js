export function normalizeText(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ç/g, 'c')
    .toLowerCase()
}

export function letterAudioName(letter) {
  const letterNames = {
    á: 'a_agudo',
    â: 'a_circunflexo',
    ã: 'a_til',
    é: 'e_agudo',
    í: 'i_agudo',
    ó: 'o_agudo',
    ç: 'c_cedilha',
  }
  const normalizedLetter = letter.toLowerCase()
  const accentedLetterName = letterNames[normalizedLetter]

  if (accentedLetterName) return accentedLetterName

  return normalizeText(letter)
}
