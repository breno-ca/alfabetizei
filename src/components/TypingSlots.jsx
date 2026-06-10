export function TypingSlots({ accepted, currentIndex, revealed, word }) {
  return (
    <p className="slots" aria-label={`${word.length} letras`}>
      {buildSlots({ accepted, currentIndex, revealed, word })}
    </p>
  )
}

function buildSlots({ accepted, currentIndex, revealed, word }) {
  const slots = []
  let index = 0

  for (const letter of word) {
    const isAccepted = Boolean(accepted[index])
    const className = isAccepted ? 'accepted' : ''

    const isRevealed = Boolean(revealed[index])
    const content = isRevealed ? word[index] : '_'

    const isCurrentLetter = currentIndex === index
    const soundIndicator = isCurrentLetter ? <small aria-label="ouvindo">♪</small> : null

    slots.push(
      <span className={className} key={index}>
        {content}
        {soundIndicator}
      </span>,
    )
    index += letter.length
  }

  return slots
}
