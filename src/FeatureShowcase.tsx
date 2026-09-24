import { assetUrl } from './lib/asset-url'
import { memo, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { BookOpen, Check, ChevronRight, FileText, LockKeyhole, Pause, Play, RotateCcw } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { features, type FeatureId } from './feature-stories'
import './FeatureShowcase.css'

function SourceIcon({ name }: { name: string }) {
  return <img className={`feature-source-icon ${name}`} src={assetUrl(`/apps/${name}.svg`)} alt="" />
}

const VIDEO_DURATION = 24
function useFeaturePlayback(reduced: boolean) {
  const host = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const checkpoint = new URLSearchParams(location.search).get('ft')
  const initial = checkpoint === null ? 0 : Math.max(0, Math.min(VIDEO_DURATION, Number(checkpoint) * 1.5 || 0))
  const [time, setTime] = useState(reduced ? VIDEO_DURATION : initial)
  const [playing, setPlaying] = useState(!reduced && checkpoint === null)
  const [visible, setVisible] = useState(false)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    let onScreen = false
    const update = () => setVisible(onScreen && !document.hidden)
    const observer = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting && entry.intersectionRatio >= .2; update() }, { threshold: .2 })
    if (host.current) observer.observe(host.current)
    document.addEventListener('visibilitychange', update)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update) }
  }, [])
  useEffect(() => {
    const element = video.current
    if (!element) return
    if (playing && visible) void element.play().catch(() => setPlaying(false))
    else element.pause()
  }, [playing, visible])
  const ready = () => { if (video.current && (reduced || initial > 0)) video.current.currentTime = reduced ? VIDEO_DURATION - .1 : initial }
  const replay = () => { if (video.current) video.current.currentTime = 0; setTime(0); setPlaying(true) }
  const toggle = () => { if (time >= VIDEO_DURATION - .1) replay(); else setPlaying(value => !value) }
  return { host, video, time, playing, ready, replay, toggle, failed, fail: () => { setFailed(true); setPlaying(false) }, update: () => setTime(video.current?.currentTime ?? 0), ended: () => { setTime(VIDEO_DURATION); setPlaying(false) } }
}

function ContextPanels({ time }: { time: number }) {
  const received = time >= 20
  return <>
    <article className="feature-glass"><div className="glass-eyebrow">THE CONTEXT</div><h3>Checkout incident</h3><p className="glass-description">A brief built from the work already in your apps.</p><div className="glass-source-list">
      {[
        { app: 'slack', title: 'Release investigation', detail: '#checkout-incidents', at: 4 },
        { app: 'linear', title: 'Incident brief', detail: 'ENG-241 · Checkout failure', at: 5 },
        { app: 'google-drive', title: 'Incident runbook', detail: 'Engineering · Google Drive', at: 6 },
      ].map(source => <div key={source.app} className={`glass-source ${time >= source.at ? 'is-ready' : ''}`}><SourceIcon name={source.app} /><span><strong>{source.title}</strong><small>{source.detail}</small></span><Check size={13} className="source-ready" /></div>)}
    </div></article>
    <article className="feature-glass glass-receipt"><div className="glass-eyebrow">{received ? 'RECEIVED' : time >= 14 ? 'SHARING CONTEXT' : time >= 5 ? 'READY TO SHARE' : 'PREPARING THE BRIEF'}</div><div className="glass-person"><span className="glass-initial">O</span><span><strong>Omar’s agent</strong><small>Engineering</small></span>{received && <Check size={16} />}</div><p>{received ? 'The brief, source links, and next step. Ready to investigate.' : 'The task brief and three sources. Sent after your approval.'}</p><div className="glass-private"><LockKeyhole size={12} /> Your private chat stays with you.</div></article>
  </>
}
function SkillPanels({ time }: { time: number }) {
  return <>
    <article className="feature-glass"><div className="glass-eyebrow">SHARED SKILL</div><div className="glass-title-icon"><BookOpen size={20} /><h3>Incident response</h3></div><p className="glass-description">One team procedure. Available to both agents.</p><ol className="glass-procedure"><li><span>01</span>Investigate the release</li><li className={time >= 14 ? 'is-current' : ''}><span>02</span>Verify recovery</li><li><span>03</span>Review the customer update</li></ol><a className="glass-link" href={assetUrl('/demo/skills/incident-response/SKILL.md')} target="_blank" rel="noreferrer">View the shared skill <ChevronRight size={13} /></a></article>
    <article className="feature-glass"><div className="glass-eyebrow">SAME SKILL, DIFFERENT ROLES</div><div className="glass-person"><span className="glass-initial">O</span><span><strong>Omar’s agent</strong><small>{time >= 20 ? 'Using: Verify recovery' : 'Engineering'}</small></span>{time >= 20 && <BookOpen size={15} />}</div><div className="glass-person"><span className="glass-initial">N</span><span><strong>Noura’s agent</strong><small>{time >= 20 ? 'Using: Customer update' : 'Customer Success'}</small></span>{time >= 20 && <BookOpen size={15} />}</div><div className="glass-private"><LockKeyhole size={12} /> Verification comes before sending.</div></article>
  </>
}
function CoordinationPanels({ time }: { time: number }) {
  return <>
    <article className="feature-glass"><div className="glass-eyebrow">BETWEEN THE AGENTS</div><h3 className="coordination-route">Human → agent → agent → human</h3><p className="glass-description">You talk to your agent. It coordinates with theirs. Your teammate gets what they need.</p><div className="glass-handoffs">{[
      { name: 'Your agent → Omar’s agent', detail: 'Request recovery verification', at: 4.3 },
      { name: 'Omar’s agent → Noura’s agent', detail: 'Checkout verified. Update can proceed.', at: 17 },
      { name: 'Noura’s agent → Your agent', detail: 'Approved update sent', at: 20 },
    ].map((step, index) => <div className={time >= step.at ? 'is-ready' : ''} key={step.name}><span>{time >= step.at ? <Check size={12} /> : `0${index + 1}`}</span><p><strong>{step.name}</strong><small>{step.detail}</small></p></div>)}</div></article>
    <article className="feature-glass"><div className="glass-eyebrow">PEOPLE MAKE THE DECISIONS</div><div className="glass-person"><span className="glass-initial">O</span><span><strong>Omar</strong><small>{time >= 17 ? 'Confirmed recovery' : 'Reviewing the fix'}</small></span>{time >= 17 && <Check size={15} />}</div><div className="glass-person"><span className="glass-initial">N</span><span><strong>Noura</strong><small>{time >= 19 ? 'Approved the customer update' : 'Waiting for verified recovery'}</small></span>{time >= 19 && <Check size={15} />}</div><div className="glass-private"><LockKeyhole size={12} /> Each decision happens privately.</div></article>
  </>
}
function FeatureScene({ id, reduced }: { id: FeatureId; reduced: boolean }) {
  const { host, video, time: videoTime, playing, ready, replay, toggle, failed, fail, update, ended } = useFeaturePlayback(reduced)
  const time = videoTime
  const story = features.find(feature => feature.id === id)!
  return <div ref={host} className="feature-scene">
    <div className="feature-phone" aria-label={`${story.title} video demonstration`}>
      <div className="feature-phone-canvas">
        <video ref={video} className="feature-phone-screen feature-phone-video" src={assetUrl(`/videos/${id}.mp4`)} poster={assetUrl(`/videos/${id}.jpg`)} muted playsInline preload="metadata" onLoadedMetadata={ready} onTimeUpdate={update} onEnded={ended} onError={fail} aria-label={`${story.title}: a private conversation and agent task details`} />
        <img className="feature-phone-bezel" src={assetUrl('/device/iphone-15-black.png')} width="1419" height="2796" alt="" loading="lazy" />
      </div>
      <details className="feature-transcript"><summary>{failed ? 'Video unavailable — read the demo' : 'Read the conversation'}</summary>{story.messages.map((message,index) => <p key={index}><strong>{message.role === 'user' ? 'You' : 'DeltaNet'}:</strong> {message.text}</p>)}</details>
    </div>
    <div className="feature-evidence" aria-label="What the agents share">
      <AnimatePresence initial={false} mode="wait"><motion.div key={id} initial={{ opacity: 0, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .3 }} className="feature-evidence-stack">
        {id === 'context' ? <ContextPanels time={time} /> : id === 'skills' ? <SkillPanels time={time} /> : <CoordinationPanels time={time} />}
      </motion.div></AnimatePresence>
      <div className="feature-player"><Button variant="ghost" size="icon-sm" onClick={toggle} disabled={failed} aria-label={playing ? 'Pause feature demo' : time >= VIDEO_DURATION ? 'Replay feature demo' : 'Play feature demo'}>{playing ? <Pause size={13} /> : <Play size={13} />}</Button><Button variant="ghost" size="icon-sm" onClick={replay} disabled={failed} aria-label="Restart feature demo"><RotateCcw size={13} /></Button><span className="feature-progress" role="progressbar" aria-label="Feature demo progress" aria-valuemin={0} aria-valuemax={VIDEO_DURATION} aria-valuenow={Math.floor(time)}><span style={{ transform: `scaleX(${time / VIDEO_DURATION})` }} /></span><span className="feature-duration">{Math.floor(videoTime)} / {VIDEO_DURATION}s</span></div>
      <p className="feature-fixture">Illustrative workflow · sample data</p>
    </div>
  </div>
}

export const FeatureShowcase = memo(function FeatureShowcase() {
  useEffect(() => {
    if (location.hash === '#features') document.getElementById('features')?.scrollIntoView({ block: 'start' })
  }, [])
  const reduced = !!useReducedMotion()
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 850px)').matches)
  useEffect(() => {
    const media = window.matchMedia('(max-width: 850px)')
    const update = () => setCompact(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  const [active, setActive] = useState<FeatureId>(() => {
    const selected = new URLSearchParams(location.search).get('feature')
    return features.find(feature => feature.id === selected)?.id ?? 'context'
  })
  return <section id="features" className="feature-showcase dark" aria-labelledby="feature-heading">
    <header className="feature-section-heading"><p className="feature-overline">A PERSONAL AGENT. A CONNECTED TEAM.</p><h2 id="feature-heading">Private work.<br />Shared progress.</h2><p>Keep your own conversation. Give your agents<br className="desktop-break" /> the context and skills to work together.</p></header>
    <Tabs value={active} onValueChange={value => setActive(value as FeatureId)} orientation={compact ? 'horizontal' : 'vertical'} className="feature-explorer">
      <div className="feature-selector"><TabsList variant="line" aria-label="Explore multiplayer features">{features.map((feature, index) => <TabsTrigger value={feature.id} key={feature.id}><span className="feature-tab-number">0{index + 1}</span><span><strong>{feature.title}</strong><small>{feature.description}</small></span><ChevronRight size={15} /></TabsTrigger>)}</TabsList><p className="feature-selector-note"><FileText size={13} /> One incident. Three ways to work together.</p></div>
      <TabsContent value={active} className="feature-content"><FeatureScene key={active} id={active} reduced={reduced} /></TabsContent>
    </Tabs>
  </section>
})
