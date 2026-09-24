import { useEffect, useRef, useState } from 'react'
import { DURATION } from './walkthrough'
export function useWalkthrough() {
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const queryTime = Number(new URLSearchParams(window.location.search).get('t'))
  const hasQueryTime = new URLSearchParams(window.location.search).has('t')
  const initial = hasQueryTime ? Math.max(0, Math.min(DURATION, Number.isFinite(queryTime) ? queryTime : 0)) : reduced ? DURATION : 0
  const [time, setTime] = useState(initial)
  const [playing, setPlaying] = useState(!hasQueryTime && !reduced)
  const position = useRef(initial)
  useEffect(() => {
    if (!playing) return
    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      const elapsed = document.hidden ? 0 : Math.max(0, Math.min((now - last) / 1000, .1))
      last = now
      position.current = Math.min(DURATION, position.current + elapsed)
      setTime(position.current)
      if (position.current >= DURATION) { setPlaying(false); return }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [playing])
  const seek = (next: number) => { position.current = Math.max(0, Math.min(DURATION, next)); setTime(position.current); setPlaying(false) }
  const replay = () => { position.current = 0; setTime(0); setPlaying(true) }
  const toggle = () => { if (position.current >= DURATION) replay(); else setPlaying(value => !value) }
  return { time, playing, pause: () => setPlaying(false), seek, replay, toggle, reduced: reduced }
}
