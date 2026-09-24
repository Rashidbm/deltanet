import { memo, useEffect, useRef, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { BookOpen, Check, ChevronRight, FileText, LockKeyhole, Pause, Play, RotateCcw, ArrowRight } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { features, STORY_DURATION, storyActivity, visibleStoryText, type FeatureId } from './feature-stories'
import './FeatureShowcase.css'

function SystemIcon({ name }: { name: string }) {
  return <span className="phone-system-icon" style={{ '--symbol': `url('/device/icons/${name}.png')` } as CSSProperties} aria-hidden="true" />
}
function SourceIcon({ name }: { name: string }) {
  return <img className={`feature-source-icon ${name}`} src={`/apps/${name}.svg`} alt="" />
}

function useFeaturePlayback(reduced: boolean) {
  const host = useRef<HTMLDivElement>(null)
  const query = new URLSearchParams(location.search)
  const checkpoint = query.has('ft') ? Math.max(0, Math.min(STORY_DURATION, Number(query.get('ft')) || 0)) : null
  const [time, setTime] = useState(reduced ? STORY_DURATION : checkpoint ?? 0)
  const [playing, setPlaying] = useState(!reduced && checkpoint === null)
  const [visible, setVisible] = useState(false)
  const position = useRef(time)
  useEffect(() => {
    let onScreen = false
    const update = () => setVisible(onScreen && !document.hidden)
    const observer = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting && entry.intersectionRatio >= .2; update() }, { threshold: .2 })
    if (host.current) observer.observe(host.current)
    document.addEventListener('visibilitychange', update)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update) }
  }, [])
  useEffect(() => {
    if (!playing || !visible || reduced) return
    let raf = 0
    let last = performance.now()
    let painted = -1
    const tick = (now: number) => {
      position.current = Math.min(STORY_DURATION, position.current + Math.max(0, Math.min((now - last) / 1000, .1)))
      last = now
      const next = Math.floor(position.current * 30) / 30
      if (next !== painted) { setTime(next); painted = next }
      if (position.current >= STORY_DURATION) { setPlaying(false); return }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, visible, reduced])
  const replay = () => { position.current = reduced ? STORY_DURATION : 0; setTime(position.current); setPlaying(!reduced) }
  const toggle = () => { if (time >= STORY_DURATION) replay(); else setPlaying(value => !value) }
  return { host, time: reduced ? STORY_DURATION : time, playing: playing && !reduced, replay, toggle }
}

function PhoneStory({ id, time, reduced }: { id: FeatureId; time: number; reduced: boolean }) {
  const story = features.find(feature => feature.id === id)!
  const typingMessage = story.messages.find(message => message.role === 'user' && time >= message.at - 1.7 && time < message.at)
  const draft = typingMessage ? typingMessage.text.slice(0, Math.ceil((time - (typingMessage.at - 1.7)) / 1.7 * typingMessage.text.length)) : ''
  return <div className="feature-phone" aria-label={`${story.title} phone demonstration`}>
    <div className="feature-phone-canvas">
      <div className="feature-phone-screen">
        <div className="feature-phone-status" aria-hidden="true"><b>9:41</b><span><SystemIcon name="cellularbars" /><SystemIcon name="wifi" /><SystemIcon name="battery.100percent" /></span></div>
        <div className="feature-phone-nav" aria-hidden="true"><span className="phone-nav-control"><SystemIcon name="line.3.horizontal" /></span><span className="phone-nav-title">DeltaNet <SystemIcon name="chevron.down" /></span><span className="phone-nav-control"><SystemIcon name="square.and.pencil" /></span></div>
        <div className="phone-private-label"><LockKeyhole size={12} /> Your private workspace</div>
        <div className="feature-phone-thread">
          {story.messages.filter(message => time >= message.at).map((message, index) => <motion.p key={`${id}-${index}`} className={`phone-story-message ${message.role}`} initial={{ opacity: 0, y: reduced ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .2 }}>{visibleStoryText(message, time)}</motion.p>)}
        </div>
        <div className="feature-phone-bottom">
          <div className="phone-story-activity"><span className="phone-activity-label">Agent activity</span><AnimatePresence mode="wait" initial={false}><motion.div key={storyActivity(id, time)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .15 }}><span className="phone-activity-indicator">{time >= 12 ? <Check size={15} /> : <ArrowRight size={15} />}</span>{storyActivity(id, time)}</motion.div></AnimatePresence></div>
          <div className="feature-phone-composer" aria-hidden="true"><div className={draft ? 'phone-draft' : 'phone-draft empty'}>{draft || 'Message DeltaNet'}</div><div className="phone-composer-tools"><SystemIcon name="plus" /><span className="phone-send"><SystemIcon name="arrow.up" /></span></div></div>
        </div>
        <div className="feature-phone-home" aria-hidden="true" />
      </div>
      <img className="feature-phone-bezel" src="/device/iphone-15-black.png" width="1419" height="2796" alt="" loading="lazy" />
    </div>
  </div>
}

function ContextPanels({ time }: { time: number }) {
  const received = time >= 10.2
  return <>
    <article className="feature-glass"><div className="glass-eyebrow">THE CONTEXT</div><h3>Checkout incident</h3><p className="glass-description">A brief built from the work already in your apps.</p><div className="glass-source-list">
      {[
        { app: 'slack', title: 'Release investigation', detail: '#checkout-incidents', at: 2.5 },
        { app: 'linear', title: 'Incident brief', detail: 'ENG-241 · Checkout failure', at: 3.3 },
        { app: 'google-drive', title: 'Incident runbook', detail: 'Engineering · Google Drive', at: 4.2 },
      ].map(source => <div key={source.app} className={`glass-source ${time >= source.at ? 'is-ready' : ''}`}><SourceIcon name={source.app} /><span><strong>{source.title}</strong><small>{source.detail}</small></span><Check size={13} className="source-ready" /></div>)}
    </div></article>
    <article className="feature-glass glass-receipt"><div className="glass-eyebrow">{received ? 'RECEIVED' : time >= 7.6 ? 'SHARING CONTEXT' : time >= 5 ? 'READY TO SHARE' : 'PREPARING THE BRIEF'}</div><div className="glass-person"><span className="glass-initial">O</span><span><strong>Omar’s agent</strong><small>Engineering</small></span>{received && <Check size={16} />}</div><p>{received ? 'The brief, source links, and next step. Ready to investigate.' : 'The task brief and three sources. Sent after your approval.'}</p><div className="glass-private"><LockKeyhole size={12} /> Your private chat stays with you.</div></article>
  </>
}
function SkillPanels({ time }: { time: number }) {
  return <>
    <article className="feature-glass"><div className="glass-eyebrow">SHARED SKILL</div><div className="glass-title-icon"><BookOpen size={20} /><h3>Incident response</h3></div><p className="glass-description">One team procedure. Available to both agents.</p><ol className="glass-procedure"><li><span>01</span>Investigate the release</li><li className={time >= 7.6 ? 'is-current' : ''}><span>02</span>Verify recovery</li><li><span>03</span>Review the customer update</li></ol><a className="glass-link" href="/demo/skills/incident-response/SKILL.md" target="_blank" rel="noreferrer">View the shared skill <ChevronRight size={13} /></a></article>
    <article className="feature-glass"><div className="glass-eyebrow">SAME SKILL, DIFFERENT ROLES</div><div className="glass-person"><span className="glass-initial">O</span><span><strong>Omar’s agent</strong><small>{time >= 10.2 ? 'Using: Verify recovery' : 'Engineering'}</small></span>{time >= 10.2 && <BookOpen size={15} />}</div><div className="glass-person"><span className="glass-initial">N</span><span><strong>Noura’s agent</strong><small>{time >= 10.2 ? 'Using: Customer update' : 'Customer Success'}</small></span>{time >= 10.2 && <BookOpen size={15} />}</div><div className="glass-private"><LockKeyhole size={12} /> Verification comes before sending.</div></article>
  </>
}
function CoordinationPanels({ time }: { time: number }) {
  return <>
    <article className="feature-glass"><div className="glass-eyebrow">BETWEEN THE AGENTS</div><h3 className="coordination-route">Human → agent → agent → human</h3><p className="glass-description">You talk to your agent. It coordinates with theirs. Your teammate gets what they need.</p><div className="glass-handoffs">{[
      { name: 'Your agent → Omar’s agent', detail: 'Request recovery verification', at: 3.2 },
      { name: 'Omar’s agent → Noura’s agent', detail: 'Checkout verified. Update can proceed.', at: 8.8 },
      { name: 'Noura’s agent → Your agent', detail: 'Approved update sent', at: 12 },
    ].map((step, index) => <div className={time >= step.at ? 'is-ready' : ''} key={step.name}><span>{time >= step.at ? <Check size={12} /> : `0${index + 1}`}</span><p><strong>{step.name}</strong><small>{step.detail}</small></p></div>)}</div></article>
    <article className="feature-glass"><div className="glass-eyebrow">PEOPLE MAKE THE DECISIONS</div><div className="glass-person"><span className="glass-initial">O</span><span><strong>Omar</strong><small>{time >= 8.8 ? 'Confirmed recovery' : 'Reviewing the fix'}</small></span>{time >= 8.8 && <Check size={15} />}</div><div className="glass-person"><span className="glass-initial">N</span><span><strong>Noura</strong><small>{time >= 11.2 ? 'Approved the customer update' : 'Waiting for verified recovery'}</small></span>{time >= 11.2 && <Check size={15} />}</div><div className="glass-private"><LockKeyhole size={12} /> Each decision happens privately.</div></article>
  </>
}
function FeatureScene({ id, reduced }: { id: FeatureId; reduced: boolean }) {
  const { host, time, playing, replay, toggle } = useFeaturePlayback(reduced)
  return <div ref={host} className="feature-scene">
    <PhoneStory id={id} time={time} reduced={reduced} />
    <div className="feature-evidence" aria-label="What the agents share">
      <AnimatePresence initial={false} mode="wait"><motion.div key={id} initial={{ opacity: 0, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .3 }} className="feature-evidence-stack">
        {id === 'context' ? <ContextPanels time={time} /> : id === 'skills' ? <SkillPanels time={time} /> : <CoordinationPanels time={time} />}
      </motion.div></AnimatePresence>
      <div className="feature-player"><Button variant="ghost" size="icon-sm" onClick={toggle} disabled={reduced} aria-label={playing ? 'Pause feature demo' : time >= STORY_DURATION ? 'Replay feature demo' : 'Play feature demo'}>{playing ? <Pause size={13} /> : <Play size={13} />}</Button><Button variant="ghost" size="icon-sm" onClick={replay} disabled={reduced} aria-label="Restart feature demo"><RotateCcw size={13} /></Button><span className="feature-progress" role="progressbar" aria-label="Feature demo progress" aria-valuemin={0} aria-valuemax={STORY_DURATION} aria-valuenow={Math.floor(time)}><span style={{ transform: `scaleX(${time / STORY_DURATION})` }} /></span><span className="feature-duration">{Math.floor(time)} / {STORY_DURATION}s</span></div>
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
