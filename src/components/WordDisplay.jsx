export function WordDisplay({ currentIndex, word }) {
  return (
    <div className="words">
      <p className="upper">
        <WordLetters currentIndex={currentIndex} upperCase word={word} />
      </p>
      <p className="cursive">
        <WordLetters currentIndex={currentIndex} word={word} />
      </p>
    </div>
  )
}

function WordLetters({ currentIndex, upperCase = false, word }) {
  const letters = []
  let index = 0

  for (const letter of word) {
    const isCurrentLetter = currentIndex === index
    const className = isCurrentLetter ? 'current-letter' : ''
    const content = formatLetter({ letter, upperCase })

    letters.push(
      <span className={className} key={`${letter}-${index}`}>
        {content}
      </span>,
    )
    index += letter.length
  }

  return letters
}

function formatLetter({ letter, upperCase }) {
  if (!upperCase) return letter

  return letter.toUpperCase()
}
