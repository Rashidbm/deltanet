import { memo, useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight, ArrowUpRight, BookOpen, Check, ChevronRight, Clock3, Cloud, Cpu, FileText, GitBranch, Layers, LockKeyhole, Moon, Pause, Play, RotateCcw, Sun, Workflow } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { appNames, architectureLayers, connectorStories, type ArchitectureLayer } from './section-stories'
import { useSectionPlayback } from './use-section-playback'
import './ProductSections.css'
import { ClosingCta } from './ClosingCta'
import { CloudWorkSurface } from './CloudWorkSurface'

const CONNECTION_TIMING = [3500, 4500, 4500] as const
const LEARNING_TIMING = [5500, 5500, 6500] as const
const CLOUD_TIMING = [4000, 4500, 5000] as const
const fade = { duration: .25, ease: [.22, 1, .36, 1] as const }

function AppMark({ app }: { app: string }) {
  return <img className={`proof-app ${app}`} src={`/apps/${app}.svg`} alt={appNames[app]} width="22" height="22" loading="lazy" />
}
function SectionHeading({ number, label, title, children }: { number: string; label: string; title: ReactNode; children: ReactNode }) {
  return <header className="proof-heading"><div><p className="proof-overline"><span>{number}</span>{label}</p><h2>{title}</h2></div><p className="proof-intro">{children}</p></header>
}
function DemoControls({ label, steps, step, playing, reduced, onStep, onToggle, onReplay }: {
  label: string; steps: string[]; step: number; playing: boolean; reduced: boolean; onStep: (step: number) => void; onToggle: () => void; onReplay: () => void
}) {
  return <div className="proof-controls"><div className="proof-steps" role="group" aria-label={`${label} chapters`}>{steps.map((name, index) => <button key={name} aria-pressed={step === index} onClick={() => onStep(index)} disabled={reduced}><span>0{index + 1}</span>{name}</button>)}</div><div className="proof-playback"><Button variant="ghost" size="icon-sm" onClick={onToggle} aria-label={`${playing ? 'Pause' : 'Play'} ${label}`} disabled={reduced}>{playing ? <Pause size={13} /> : <Play size={13} />}</Button><Button variant="ghost" size="icon-sm" onClick={onReplay} aria-label={`Replay ${label}`} disabled={reduced}><RotateCcw size={13} /></Button></div></div>
}
function Swap({ identity, children }: { identity: string | number; children: ReactNode }) {
  const reduced = useReducedMotion()
  return <AnimatePresence initial={false} mode="wait"><motion.div className="proof-swap" key={identity} initial={{ opacity: 0, transform: reduced ? 'none' : 'translateY(6px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }} exit={{ opacity: 0, transform: reduced ? 'none' : 'translateY(-4px)' }} transition={reduced ? { duration: 0 } : fade}>{children}</motion.div></AnimatePresence>
}

function ConnectionScene({ story }: { story: typeof connectorStories[number] }) {
  const { host, step, playing, reduced, choose, replay, toggle } = useSectionPlayback(CONNECTION_TIMING)
  return <div ref={host} className="connection-demo proof-demo" data-step={step}>
    <div className="connector-prompt"><span className="proof-initial">R</span><span>{story.question}</span><ArrowRight size={17} /></div>
    <div className="connection-evidence">
      {story.sources.map((source, index) => <article className={`source-excerpt ${step >= index ? 'is-found' : ''}`} key={source.app}>
        <header><AppMark app={source.app} /><span>{appNames[source.app]}</span><span className="source-index">0{index + 1}</span></header>
        <h3>{source.title}</h3><p className="excerpt-location">{source.location}</p><blockquote>“{source.quote}”</blockquote>
        <div className="excerpt-state">{step >= index ? <Check size={12} /> : <Clock3 size={12} />}{step >= index ? 'Source reviewed' : 'Finding the latest context'}</div>
      </article>)}
      <div className="context-junction" aria-hidden="true"><span /><div><img src="/logo-options/split-delta.svg" alt="" width="23" height="23" /></div><span /></div>
    </div>
    <div className={`connector-outcome ${step === 2 ? 'is-ready' : ''}`}><div className="outcome-icon"><AppMark app={story.resultApp} /></div><div><span className="proof-small-label">{step === 2 ? story.resultStatus : 'CONTEXT → ACTION'}</span><h3>{story.resultTitle}</h3><p>{story.resultMeta}</p></div><span className="outcome-check">{step === 2 ? <Check size={17} /> : <FileText size={17} />}</span></div>
    <div className="connector-caption"><Swap identity={step}><p>{step === 0 ? 'Reading the source material.' : step === 1 ? 'Checking it against the latest conversation.' : story.summary}</p></Swap></div>
    <DemoControls label="connector demo" steps={['Read', 'Connect', story.id === 'review' ? 'Act' : story.id === 'customer' ? 'Share' : 'Summarize']} step={step} playing={playing} reduced={reduced} onStep={choose} onToggle={toggle} onReplay={replay} />
  </div>
}
function ConnectionsSection() {
  const [selected, setSelected] = useState('release')
  return <section id="connections" className="product-section connections-section" aria-label="Connected applications"><div className="section-boundary">
    <SectionHeading number="02" label="CONNECTED TO YOUR WORK" title={<>Your tools.<br /><span>Working together.</span></>}>The answer is rarely in one app.<br />Your agent brings the evidence together<br className="wide-break" /> and takes the next step.</SectionHeading>
    <Tabs value={selected} onValueChange={setSelected} className="connection-tabs"><TabsList variant="line" aria-label="Connected work examples">{connectorStories.map(story => <TabsTrigger key={story.id} value={story.id}>{story.label}</TabsTrigger>)}</TabsList>{connectorStories.map(story => <TabsContent key={story.id} value={story.id}><ConnectionScene story={story} /></TabsContent>)}</Tabs>
    <div className="connector-directory">{Object.entries(appNames).map(([app, name]) => <span key={app}><AppMark app={app} /><span>{name}</span></span>)}</div>
    <p className="proof-disclosure">Illustrative workflows with sample data. No connected accounts are accessed in this preview.</p>
  </div></section>
}

function LearningSection() {
  const { host, step, playing, reduced, choose, replay, toggle } = useSectionPlayback(LEARNING_TIMING)
  return <section id="learning" className="product-section learning-section" aria-label="Learning across the team"><div className="section-boundary">
    <SectionHeading number="03" label="EXPERIENCE THAT STAYS WITH THE TEAM" title={<>Learn it once.<br /><span>Build on it together.</span></>}>Turn a useful correction into a shared skill.<br />The next person’s agent starts with<br className="wide-break" /> what your team already learned.</SectionHeading>
    <div ref={host} className="learning-demo proof-demo" data-step={step}>
      <div className="learning-scene">
        <div className="learning-conversation">
          <header className="proof-person"><span className="proof-initial">{step < 2 ? 'O' : 'R'}</span><div><strong>{step < 2 ? 'Omar’s workspace' : 'Rashid’s workspace'}</strong><span>{step < 2 ? 'After the incident' : 'The next release'}</span></div><LockKeyhole size={13} /></header>
          <Swap identity={step}>
            {step === 0 ? <><p className="learning-bubble">For checkout releases, test saved cards too. That’s what we missed.</p><div className="learning-reply"><span className="proof-small-label">DELTANET</span><p>I’ll add that to the release-check skill. Share the update with the engineering team?</p></div><div className="learning-inline-note"><GitBranch size={13} /> Skill update proposed</div></>
            : step === 1 ? <><p className="learning-bubble">Yes. Keep that check in every checkout release.</p><div className="learning-reply"><span className="proof-small-label">DELTANET</span><p>Published. The team’s agents can use the updated check on their next release.</p></div><div className="learning-inline-note"><Check size={13} /> Approved by Omar · Shared with Engineering</div></>
            : <><p className="learning-bubble">Can you run through the release checks?</p><div className="learning-reply"><span className="proof-small-label">DELTANET</span><p>I’ll check new-card and saved-card payments before clearing the release.</p><p className="learning-attribution">Using Omar’s update to Release checks.</p></div><div className="learning-inline-note"><BookOpen size={13} /> Shared skill recalled for this task</div></>}
          </Swap>
        </div>
        <div className="learning-transfer" aria-hidden="true"><span /><ArrowRight size={16} /><span /></div>
        <div className="learning-skill"><header><BookOpen size={16} /><span>Release checks</span><span className="skill-version">{step === 0 ? 'v1 → v2' : 'v2'}</span></header><div className="skill-document"><span className="proof-small-label">ENGINEERING / SHARED SKILLS</span><h3>Before checkout ships.</h3><p>Verify the payment flows before clearing a release.</p><div className="skill-check"><Check size={14} /><span>Complete a new-card payment</span></div><div className={`skill-check skill-addition ${step === 0 ? 'is-proposed' : ''}`}><span>{step === 0 ? '+' : <Check size={14} />}</span><div>Complete a saved-card payment<small>{step === 0 ? 'Proposed addition' : step === 1 ? 'Published to the team' : 'Included in Rashid’s release check'}</small></div></div><div className="skill-check"><Check size={14} /><span>Record the verification results</span></div><div className="skill-source"><span className="proof-initial">O</span><span>From Omar’s incident review<small>{step === 0 ? 'Awaiting publication' : 'Approved revision · Available to Engineering'}</small></span></div></div><a href="/demo/skills/release-checks/SKILL.md" target="_blank" rel="noreferrer">Read the shared skill <ArrowUpRight size={14} /></a></div>
      </div>
      <DemoControls label="learning demo" steps={['Correct', 'Share', 'Apply']} step={step} playing={playing} reduced={reduced} onStep={choose} onToggle={toggle} onReplay={replay} />
    </div>
    <div className="learning-principles"><p><BookOpen size={14} /><span>Useful lessons become reusable skills.</span></p><p><LockKeyhole size={14} /><span>You choose what becomes shared knowledge.</span></p></div>
  </div></section>
}

const cloudUpdates = [
  { time: '02:16', title: 'The release is being checked.', detail: 'Your agent opens GitHub and follows the team’s release-check skill.', label: 'Checking the release', icon: Moon },
  { time: '02:18', title: 'Both payment checks passed.', detail: 'New cards and saved cards. The results become shared task context.', label: 'Reading the results', icon: Cloud },
  { time: '08:00', title: 'The brief is ready when you are.', detail: 'Noura has the verified context. The customer update is ready for her review.', label: 'Preparing your brief', icon: Sun },
]
function CloudSection() {
  const { host, step, playing, reduced, choose, replay, toggle } = useSectionPlayback(CLOUD_TIMING, true)
  const update = cloudUpdates[step]
  const Icon = update.icon
  return <section id="cloud" className="cloud-work-section" aria-label="Cloud execution"><div className="section-boundary">
    <p className="proof-overline"><span>04</span>WORK CONTINUES BETWEEN CONVERSATIONS</p>
    <div ref={host} className="cloud-work-layout" data-step={step}>
      <div className="cloud-work-copy"><h2>Close your laptop.<br /><span>Keep the work moving.</span></h2><p className="cloud-work-intro">A computer for your agent.<br />Progress for your whole team.</p>
        <div className="cloud-work-update"><div className="cloud-work-time"><Icon size={17} /><span>{update.time}</span><small>IN THE CLOUD</small></div><Swap identity={step}><strong>{update.title}</strong><p>{update.detail}</p></Swap></div>
        <div className="cloud-work-controls"><div role="group" aria-label="Cloud progress">{cloudUpdates.map((item,index) => <button key={item.time} aria-label={item.label} aria-pressed={index === step} onClick={() => choose(index)} disabled={reduced}><span /></button>)}</div><Button variant="ghost" size="icon-sm" onClick={toggle} disabled={reduced} aria-label={`${playing ? 'Pause' : 'Play'} cloud demo`}>{playing ? <Pause size={13} /> : <Play size={13} />}</Button><Button variant="ghost" size="icon-sm" onClick={replay} disabled={reduced} aria-label="Replay cloud demo"><RotateCcw size={13} /></Button></div>
      </div>
      <CloudWorkSurface step={step} playing={playing} />
    </div><p className="cloud-work-note">Illustrative workflow · Sample apps and task data</p>
  </div></section>
}

const layerIcons = [Layers, Workflow, GitBranch, Cloud]
function ArchitectureDiagram({ active, onSelect, reduced }: { active: ArchitectureLayer; onSelect: (id: ArchitectureLayer) => void; reduced: boolean }) {
  return <svg className="architecture-diagram" viewBox="0 0 620 590" role="group" aria-label="Interactive DeltaNet architecture layers">
    <defs><linearGradient id="plate-top" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#222325" /><stop offset="1" stopColor="#101112" /></linearGradient><linearGradient id="plate-lit" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#424447" /><stop offset="1" stopColor="#1c1d1f" /></linearGradient><linearGradient id="plate-edge"><stop stopColor="#111213" /><stop offset="1" stopColor="#27282a" /></linearGradient></defs>
    <g className="memory-spine"><path d="M526 113V452" /><path d="M487 140H526 M487 226H526 M487 312H526 M487 398H526" /><text x="545" y="158" transform="rotate(90 545 158)">SHARED MEMORY + SKILLS</text></g>
    <path className="stack-guide" d="M98 172V461 M310 244V533 M502 163V452" />
    {[...architectureLayers].reverse().map(layer => {
      const index = architectureLayers.findIndex(item => item.id === layer.id)
      const y = 55 + index * 86
      const selected = active === layer.id
      return <g key={layer.id} role="button" tabIndex={0} aria-label={`Explore ${layer.title}`} aria-pressed={selected} className={`architecture-layer ${selected ? 'is-selected' : ''}`} onClick={() => onSelect(layer.id)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(layer.id) } }} style={{ transform: `translateY(${selected && !reduced ? -12 : 0}px)` }}>
        <path className="plate-face" d={`M98 ${y + 100} L310 ${y + 180} L502 ${y + 100} V${y + 124} L310 ${y + 204} L98 ${y + 124} Z`} fill="url(#plate-edge)" />
        <path className="plate-surface" d={`M98 ${y + 100} L290 ${y + 20} Q300 ${y + 16} 310 ${y + 20} L502 ${y + 100} L310 ${y + 180} Z`} fill={selected ? 'url(#plate-lit)' : 'url(#plate-top)'} />
        <path className="plate-seam" d={`M310 ${y + 180} V${y + 204}`} />
        <text x="299" y={y + 145} textAnchor="middle" className="plate-label">{layer.title}</text>
        <text x="299" y={y + 165} textAnchor="middle" className="plate-number">0{index + 1}</text>
        <path className="plate-signal" d={`M111 ${y + 100} L310 ${y + 174} L485 ${y + 102}`} />
      </g>
    })}
    <text x="98" y="575" className="diagram-caption">DELTANET / CONCEPTUAL ARCHITECTURE</text>
  </svg>
}
function ArchitectureSection() {
  const [active, setActive] = useState<ArchitectureLayer>('coordination')
  const reduced = !!useReducedMotion()
  const layer = architectureLayers.find(item => item.id === active)!
  return <section id="architecture" className="product-section architecture-section" aria-label="DeltaNet architecture"><div className="section-boundary">
    <SectionHeading number="05" label="THE SYSTEM BEHIND THE WORK" title={<>Built for work<br /><span>that carries forward.</span></>}>A workspace for each person.<br />A system that connects their agents.<br className="wide-break" /> Knowledge that stays with the team.</SectionHeading>
    <div className="architecture-explorer"><div className="architecture-visual"><ArchitectureDiagram active={active} onSelect={setActive} reduced={reduced} /></div><div className="architecture-inspector"><div className="architecture-tabs" role="group" aria-label="Architecture layers">{architectureLayers.map((item, index) => { const Icon = layerIcons[index]; return <button aria-pressed={active === item.id} key={item.id} onClick={() => setActive(item.id)}><Icon size={15} /><span>{item.title}</span></button> })}</div><div className="architecture-detail" aria-live="polite"><Swap identity={active}><span className="proof-small-label">{layer.title}</span><h3>{layer.sub}</h3><p>{layer.description}</p><div className="architecture-chips">{layer.chips.map(chip => <span key={chip}>{chip}</span>)}</div><div className="architecture-example"><span className="proof-small-label">IN THE RELEASE WORKFLOW</span><p>{layer.example}</p></div></Swap></div><div className="harness-connections"><div><Cpu size={15} /><span>Models<small>Reasoning for the task</small></span></div><div><ArrowUpRight size={15} /><span>Tools & connectors<small>Read and act in your apps</small></span></div><p>Connected to the harness</p></div></div></div>
    <div className="architecture-memory"><BookOpen size={20} /><div><h3>Every layer works with the right knowledge.</h3><p>Personal memory stays personal. Shared context and published skills reach the agents working on the task.</p></div><a href="#learning">See how learning carries forward <ChevronRight size={14} /></a></div>

  </div></section>
}

export const ProductSections = memo(function ProductSections() {
  useEffect(() => {
    const id = location.hash.slice(1)
    if (['connections', 'learning', 'cloud', 'architecture', 'join'].includes(id)) document.getElementById(id)?.scrollIntoView({ block: 'start' })
  }, [])
  return <div className="product-sections dark"><ConnectionsSection /><LearningSection /><CloudSection /><ArchitectureSection /><ClosingCta /><div className="site-footer-section"><div className="section-boundary"><footer className="product-footer"><a className="product-footer-brand" href="?hero=1"><img src="/logo-options/split-delta.svg" alt="" width="22" height="22" />DeltaNet</a><span>Private work. Shared progress.</span><a href="#product-preview">Back to the demo <ArrowRight size={13} /></a></footer></div></div></div>
})
