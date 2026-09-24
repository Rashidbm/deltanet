import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'

// Advance only at story boundaries. No per-frame React updates for these sections.
export function useSectionPlayback(durations: readonly number[], loop = false) {
  const reduced = !!useReducedMotion()
  const checkpoint = new URLSearchParams(location.search).get('proof')
  const initial = checkpoint === null ? 0 : Math.max(0, Math.min(durations.length - 1, Number(checkpoint) || 0))
  const host = useRef<HTMLDivElement>(null)
  const [state, setState] = useState({ step: initial, playing: checkpoint === null, revision: 0, ended: false })
  const [visible, setVisible] = useState(false)
  const remaining = useRef(durations[initial])
  const lastKey = useRef('')
  useEffect(() => {
    let intersecting = false
    const update = () => setVisible(intersecting && !document.hidden)
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting && entry.intersectionRatio >= .15
      update()
    }, { threshold: [.15] })
    if (host.current) observer.observe(host.current)
    document.addEventListener('visibilitychange', update)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update) }
  }, [])
  useEffect(() => {
    const key = `${state.step}-${state.revision}`
    if (lastKey.current !== key) { remaining.current = durations[state.step]; lastKey.current = key }
    if (!visible || !state.playing || reduced) return
    const started = performance.now()
    let fired = false
    const timeout = window.setTimeout(() => {
      fired = true
      setState(current => current.step === durations.length - 1
        ? loop ? { ...current, step: 0, revision: current.revision + 1 } : { ...current, playing: false, ended: true }
        : { ...current, step: current.step + 1 })
    }, remaining.current)
    return () => {
      clearTimeout(timeout)
      if (!fired) remaining.current = Math.max(0, remaining.current - (performance.now() - started))
    }
  }, [durations, state.step, state.playing, state.revision, visible, reduced, loop])
  const choose = (step: number) => setState(current => ({ step, playing: false, ended: false, revision: current.revision + 1 }))
  const replay = () => setState(current => ({ step: 0, playing: true, ended: false, revision: current.revision + 1 }))
  const toggle = () => setState(current => current.ended
    ? { step: 0, playing: true, ended: false, revision: current.revision + 1 }
    : { ...current, playing: !current.playing })
  return { host, step: reduced ? durations.length - 1 : state.step, playing: state.playing && !reduced, running: state.playing && !reduced && visible, reduced, choose, replay, toggle, revision: state.revision }
}
