import { memo } from 'react'

// The headline behaves like one shared document. Each editor owns a phrase;
// selection, replacement and caret positions derive from the independent, looping hero clock.
type Edit = { at: number; text: string }
const obstacles: Edit[] = [
  { at: 10.5, text: 'bottleneck.' },
  { at: 22.5, text: 'middleman.' },
]
const subjects: Edit[] = [
  { at: 5, text: 'your team’s agents' },
  { at: 25, text: 'your agents' },
]
const actions: Edit[] = [
  { at: 6.1, text: 'share context.' },
  { at: 16, text: 'share skills.' },
  { at: 26.1, text: 'work together.' },
]

function phraseAt(initial: string, edits: Edit[], time: number) {
  let text = initial
  for (const edit of edits) {
    const phase = time - edit.at
    if (phase < -.6) break
    if (phase < 0) return { text, full: text, selected: false, present: true, typing: false }
    if (phase < .65) return { text, full: text, selected: true, present: true, typing: false }
    const count = Math.floor((phase - .65) * 18)
    if (count < edit.text.length) return { text: edit.text.slice(0, count), full: edit.text, selected: false, present: true, typing: true }
    text = edit.text
    if (phase < 3.8) return { text, full: text, selected: false, present: true, typing: false }
  }
  return { text, full: text, selected: false, present: false, typing: false }
}

function EditablePhrase({ initial, edits, name, time, reduced }: {
  initial: string; edits: Edit[]; name: string; time: number; reduced: boolean
}) {
  const state = phraseAt(initial, edits, reduced ? 0 : time)
  return <span className="coauthor-phrase">
    {/* Reserve the complete replacement while typing; preserve natural word spacing. */}
    <span className="coauthor-measure">{state.full}</span>
    <span className="coauthor-text-slot"><span className={`coauthor-text ${state.selected ? 'is-selected' : ''}`}>
      {state.text}<span className={`coauthor-caret ${state.present ? 'is-present' : ''} ${state.typing ? 'is-typing' : ''}`}>
        <span className="coauthor-name">{name}</span>
      </span>
    </span></span>
  </span>
}

/** Dock's named selection/caret language, adapted into actual phrase edits. */
export const HeroHeadline = memo(function HeroHeadline({ time, reduced }: { time: number; reduced: boolean }) {
  return <div className="collaborative-heading">
    <h1 aria-label="Stop being the middleman. Let your agents work together.">
      <span className="sr-only">Stop being the middleman. Let your agents work together.</span>
      <span aria-hidden="true">
        <span className="headline-lead">Stop being<span className="headline-break"> </span>the <EditablePhrase initial="middleman." edits={obstacles} name="Omar" time={time} reduced={reduced} /></span>
        <span className="coauthored-line">Let{' '}
          <EditablePhrase initial="your agents" edits={subjects} name="Omar" time={time} reduced={reduced} />{' '}
          <EditablePhrase initial="work together." edits={actions} name="Noura" time={time} reduced={reduced} />
        </span>
      </span>
    </h1>
  </div>
}, (previous, next) => Math.floor(previous.time * 30) === Math.floor(next.time * 30) && previous.reduced === next.reduced)
