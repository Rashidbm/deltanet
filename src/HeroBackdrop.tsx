import { lazy, memo, Suspense, useEffect, useRef, useState } from 'react'

// Reuse Paper's Mesh Gradient (Ink preset), not a custom shader. See SOURCES.md.
const MeshGradient = lazy(() => import('@paper-design/shaders-react').then(module => ({ default: module.MeshGradient })))
const colors = ['#7f858e', '#08090b', '#121418', '#34383f']

export const HeroBackdrop = memo(function HeroBackdrop({ reduced }: { reduced: boolean }) {
  const host = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(true)
  const [supported] = useState(() => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2')
    if (!context) return false
    context.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  })
  useEffect(() => {
    let intersects = true
    const update = () => setActive(intersects && !document.hidden)
    const observer = new IntersectionObserver(([entry]) => { intersects = entry.isIntersecting; update() })
    if (host.current) observer.observe(host.current)
    document.addEventListener('visibilitychange', update)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update) }
  }, [])
  return <div className="hero-backdrop" ref={host} aria-hidden="true" data-ambient-active={active && !reduced}>
    {supported && <Suspense fallback={null}><MeshGradient className="hero-shader" width="100%" height="100%"
      colors={colors} distortion={1} swirl={.2} rotation={90} scale={.95} grainOverlay={.035}
      speed={active && !reduced ? .12 : 0} frame={48000} minPixelRatio={1} maxPixelCount={650000}
      webGlContextAttributes={{ antialias: false, powerPreference: 'low-power' }} /></Suspense>}
  </div>
})
