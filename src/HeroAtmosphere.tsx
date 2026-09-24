import { memo, useEffect, useRef, useState } from 'react'
import { HeroHeadline } from './HeroHeadline'

/** The ambient hero has its own looping clock; product-demo controls don't stop it. */
export const HeroAtmosphere = memo(function HeroAtmosphere({ reduced }: { reduced: boolean }) {
  const host = useRef<HTMLDivElement>(null)
  const [time, setTime] = useState(0)
  const elapsed = useRef(0)
  const [active, setActive] = useState(false)
  useEffect(() => {
    let onScreen = false
    const update = () => setActive(onScreen && !document.hidden)
    const observer = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; update() })
    if (host.current) observer.observe(host.current)
    document.addEventListener('visibilitychange', update)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update) }
  }, [])
  useEffect(() => {
    if (reduced || !active) return
    let frame = 0
    let last = performance.now()
    let painted = -1
    const tick = (now: number) => {
      elapsed.current = (elapsed.current + Math.max(0, now - last) / 1000) % 30
      last = now
      const next = Math.floor(elapsed.current * 30) / 30
      if (next !== painted) { setTime(next); painted = next }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, reduced])
  return <div ref={host} data-hero-cycle={Math.floor(time)}><HeroHeadline time={time} reduced={reduced} /></div>
})
