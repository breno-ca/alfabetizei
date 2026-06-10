import { useEffect, useRef, useState } from 'react'
import { PracticeStage } from './components/PracticeStage'
import { TypingSlots } from './components/TypingSlots'
import { playLetter, playSuccess, playWord } from './lib/audio'
import { normalizeText } from './lib/text'
import { getRandomWord } from './lib/words'

const INITIAL_WORD = 'alfabeto'
const LETTER_AUDIO_GAP_MS = 180

export function App() {
  const [word, setWord] = useState(INITIAL_WORD)
  const [accepted, setAccepted] = useState('')
  const [revealed, setRevealed] = useState('')
  const [speakingIndex, setSpeakingIndex] = useState(null)
  const [audioCursor, setAudioCursor] = useState(0)
  const keyboardInput = useRef(null)
  const playingLetters = useRef(false)

  const resetExercise = (nextWord) => {
    setWord(nextWord)
    setAccepted('')
    setRevealed('')
    setSpeakingIndex(null)
    setAudioCursor(0)
  }

  const removeLastAcceptedLetter = () => {
    setAccepted((current) => current.slice(0, -1))

    const acceptedIsAlreadyRevealed = accepted.length <= revealed.length
    const noLetterIsBeingPresented = speakingIndex === null

    if (!acceptedIsAlreadyRevealed) return
    if (!noLetterIsBeingPresented) return

    setRevealed((current) => current.slice(0, -1))
    setAudioCursor((current) => Math.max(0, current - 1))
  }

  const acceptTypedLetter = (typedKey) => {
    const normalizedWord = normalizeText(word)
    const typedLetter = normalizeText(typedKey)
    const nextLetter = normalizedWord[accepted.length]

    if (accepted.length >= normalizedWord.length) return
    if (typedLetter !== nextLetter) return

    setAccepted((current) => current + nextLetter)
  }

  const focusKeyboardInput = () => {
    keyboardInput.current?.focus()
  }

  useEffect(() => {
    if (playingLetters.current || audioCursor >= accepted.length) return

    const playNextLetter = async () => {
      playingLetters.current = true
      setSpeakingIndex(audioCursor)
      setRevealed((current) => current + word[audioCursor])

      await playLetter(word[audioCursor])
      await wait(LETTER_AUDIO_GAP_MS)

      setSpeakingIndex(null)
      setAudioCursor((current) => current + 1)

      playingLetters.current = false
    }

    playNextLetter()
  }, [accepted, audioCursor, word])

  useEffect(() => {
    const wordIsFullyRevealed = revealed.length === word.length
    const audioQueueIsComplete = audioCursor === accepted.length

    if (!wordIsFullyRevealed) return
    if (!audioQueueIsComplete) return
    if (playingLetters.current) return

    const timeout = setTimeout(async () => {
      await playSuccess()
      await playWord(word)

      resetExercise(getRandomWord(word))
    }, 800)

    return () => clearTimeout(timeout)
  }, [accepted.length, audioCursor, revealed.length, word])

  useEffect(() => {
    const onKeyDown = (event) => {
      const cameFromKeyboardInput = event.target === keyboardInput.current
      if (cameFromKeyboardInput) return

      if (event.key === 'Backspace') {
        removeLastAcceptedLetter()
        return
      }

      if (event.key.length !== 1) return

      acceptTypedLetter(event.key)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [accepted.length, revealed.length, speakingIndex, word])

  return (
    <main className="screen" onClick={focusKeyboardInput}>
      <p className="hint">leia, ouça, digite</p>

      <PracticeStage currentIndex={speakingIndex} onPlayWord={() => playWord(word)} word={word} />
      <TypingSlots accepted={accepted} currentIndex={speakingIndex} revealed={revealed} word={word} />

      <input
        ref={keyboardInput}
        className="keyboard-input"
        inputMode="text"
        autoCapitalize="none"
        autoComplete="off"
        aria-label="Digite a palavra"
        onBeforeInput={(event) => {
          if (!event.data) return

          acceptTypedLetter(event.data)
        }}
        onKeyDown={(event) => {
          if (event.key !== 'Backspace') return

          removeLastAcceptedLetter()
        }}
      />
    </main>
  )
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}
