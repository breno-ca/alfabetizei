import { WordDisplay } from './WordDisplay'

export function PracticeStage({ currentIndex, onPlayWord, word }) {
  return (
    <section className="practice">
      <WordDisplay currentIndex={currentIndex} word={word} />

      <button className="sound" type="button" onClick={onPlayWord}>
        ouvir palavra
      </button>
    </section>
  )
}
