import { useEffect, useRef, useState } from 'react'
import { assetUrl } from './lib/asset-url'
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronRight, Clock3, Menu, Minus, MoreHorizontal, MousePointer2, Paperclip, Pencil, Plus, RotateCw, Search, Settings2, Star, Trash2, X, Undo2, Redo2, Printer, PaintRoller, Bold, Italic, Underline, AlignLeft, ListFilter, Link2, MessageSquare, LockKeyhole, Maximize2 } from 'lucide-react'
import './CloudWorkSurface.css'

const apps = [
  { title: 'Research', image: '', url: 'google.com/search?q=customer+onboarding+tools' },
  { title: 'Vendor shortlist', image: 'google-sheets.webp', url: 'docs.google.com/spreadsheets/d/vendor-shortlist/edit' },
  { title: 'Draft — Gmail', image: 'gmail.svg', url: 'mail.google.com/mail/u/0/#drafts' },
]
const vendors = [
  ['Northstar', 'Onboarding', '$249 / mo', 'SOC 2', 'Shortlisted'],
  ['Aperture', 'Customer success', '$399 / mo', 'SOC 2', 'Shortlisted'],
  ['Meridian', 'Onboarding', '$199 / mo', 'In review', 'Needs review'],
]
const draft = 'Hi Noura,\n\nI’ve compared the three onboarding tools against our requirements and added pricing, security notes, and source links to the shortlist.\n\nNorthstar and Aperture meet the requirements. Meridian still needs a security review.\n\nCould you review the shortlist before we book the demos?'

function AppIcon({ name }: { name: string }) { return <img src={assetUrl(`/apps/${name}`)} alt="" /> }
function AgentCursor({ name, x, y, visible }: { name: string; x: string; y: string; visible: boolean }) {
  return <div className="work-agent-cursor" aria-hidden="true" style={{ left: x, top: y, opacity: visible ? 1 : 0 }}><MousePointer2 size={20} fill="#f5f5f5" stroke="#262626" strokeWidth={1.5} /><span>{name}</span></div>
}

/** Reference: Google Workspace's Sheets cheat sheet and Gmail compose UI.
 * Fictional task data; visitor controls explore the illustration without external actions.
 */
export function CloudWorkSurface({ step, playing, revision, onChoose }: { step: number; playing: boolean; revision: number; onChoose: (step: number) => void }) {
  const [elapsed, setElapsed] = useState(0)
  const [activityOpen, setActivityOpen] = useState(false)
  const [selectedSource, setSelectedSource] = useState(0)
  const [cell, setCell] = useState('C4')
  const [reviewing, setReviewing] = useState(false)
  const previous = useRef(`${step}-${revision}`)
  const elapsedRef = useRef(0)
  // Local clock only updates this small illustration. It pauses with the section.
  useEffect(() => {
    const key = `${step}-${revision}`
    if (previous.current !== key) {
      if (previous.current.split('-')[0] !== String(step)) { setReviewing(false); setSelectedSource(0); setCell('C4') }
      previous.current = key
      elapsedRef.current = playing ? 0 : 8
      setElapsed(elapsedRef.current)
    }
    if (!playing) return
    const timer = window.setInterval(() => {
      elapsedRef.current = Math.min(8, elapsedRef.current + .05)
      setElapsed(elapsedRef.current)
    }, 50)
    return () => clearInterval(timer)
  }, [step, revision, playing])
  const time = !playing && elapsed === 0 ? 8 : elapsed
  const inspect = () => onChoose(step)
  const rows = Math.min(3, Math.max(0, Math.floor(time / .95)))
  const cellValue = vendors[Number(cell.slice(1)) - 2]?.[cell.charCodeAt(0) - 65] ?? ''
  const text = draft.slice(0, Math.max(0, Math.floor((time - .8) * 68)))
  const actions = [
    ['02:14', 'Rashid’s agent', 'Compared three vendors', 'Read product pages, pricing, and security documentation. Source links are attached to each row.'],
    ['02:17', 'Rashid’s agent → Noura’s agent', 'Shared the shortlist and requirements', 'Three vendors, two qualified options, one open security question. Only task context is shared.'],
    ['02:19', 'Noura’s agent', 'Prepared a draft for review', 'The recommendation is saved in Gmail. Noura reviews it before anything is sent.'],
  ]
  return <div className="work-desktop" data-playing={playing}>
    <div className="work-mac-menu" aria-hidden="true"><span className="mac-apple"></span><b>Chrome</b><span>File</span><span>Edit</span><span>View</span><span>History</span><span className="mac-menu-time">Fri 02:{step === 0 ? '14' : step === 1 ? '17' : '19'}</span></div>
    <div className="work-window">
      <div className="work-tabs"><div className="work-traffic" aria-hidden="true"><i /><i /><i /></div><div className="work-tab-list" role="tablist" aria-label="Explore the agent’s apps">{apps.map((app,index) => <button key={app.title} role="tab" id={`work-tab-${index}`} aria-selected={step === index} aria-controls="work-app-panel" tabIndex={step === index ? 0 : -1} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); const next = (index + (event.key === 'ArrowRight' ? 1 : 2)) % 3; onChoose(next); document.getElementById(`work-tab-${next}`)?.focus() } }} onClick={() => onChoose(index)}>{app.image ? <AppIcon name={app.image} /> : <Search size={11} />}{app.title}<X size={9} /></button>)}</div><Plus size={12} /></div>
      <div className="work-address" aria-hidden="true"><ArrowLeft /><ArrowRight /><RotateCw /><span><Settings2 size={10} />{apps[step].url}<Star size={10} /></span><MoreHorizontal /></div>
      <div className="work-app-panel" id="work-app-panel" role="tabpanel" aria-labelledby={`work-tab-${step}`}>
        {step === 0 && <div className="work-search">
          <div className="work-search-top"><img className="google-word" src={assetUrl('/apps/google-wordmark.svg')} alt="Google" /><div className="work-search-input">{time < 1.5 ? 'customer onboarding tools'.slice(0, Math.floor(time * 22)) : 'customer onboarding tools'}<Search size={13} /></div><span className="work-profile">R</span></div>
          <div className="work-search-filters"><b>All</b><span>Images</span><span>Videos</span><span>News</span><span>More</span><span>Tools</span></div>
          <div className={`work-search-results ${time > 1.1 ? 'is-visible' : ''}`}>
            {vendors.map((vendor,index) => <button className="work-search-result" key={vendor[0]} onClick={() => { inspect(); setSelectedSource(index) }}><span className="result-site"><span>{vendor[0][0]}</span><span>{vendor[0]}<small>https://{vendor[0].toLowerCase()}.example › product</small></span><MoreHorizontal size={11} /></span><strong>{vendor[0]} — {index === 1 ? 'Customer success, connected' : 'Customer onboarding software'}</strong><p>{index === 0 ? 'Bring your onboarding process into one place. Build repeatable playbooks, track customer progress, and keep your team aligned.' : index === 1 ? 'A shared workspace for customer success. Manage onboarding, monitor account health, and automate the routine work.' : 'Get customers to their first success faster. Compare plans, explore integrations, and see how it works.'}</p></button>)}
          </div>
          {(time > 4.8) && <div className="work-source-popover"><span>READ FROM SOURCE <Check size={10} /></span><strong>{vendors[selectedSource][0]} · Pricing & security</strong><p>{vendors[selectedSource][2]}. {selectedSource === 2 ? 'Security documentation needs review.' : 'SOC 2 report available on request.'}</p><small>Added to the vendor comparison</small></div>}
          <AgentCursor name="Rashid’s agent" x={time > 4 ? '69%' : '45%'} y={time > 4 ? '62%' : '40%'} visible={time > 1.3} />
        </div>}
        {step === 1 && <div className="work-sheets">
          <header className="sheets-heading"><AppIcon name="google-sheets.webp" /><div><strong>Vendor shortlist <Star size={10} /><Check size={11} /></strong><nav>File <span>Edit</span><span>View</span><span>Insert</span><span>Format</span><span>Data</span><span>Tools</span><span>Extensions</span><span>Help</span></nav></div><span className="sheet-person">R</span><button className="sheets-share" onClick={() => { inspect(); setActivityOpen(true) }}><LockKeyhole size={10} />Share</button></header>
          <div className="sheets-toolbar" aria-hidden="true"><Undo2 /><Redo2 /><Printer /><PaintRoller /><span>100%⌄</span><span>$</span><span>%</span><span>.00</span><span>123</span><i /><span>Arial ⌄</span><span>10</span><i /><Bold /><Italic /><Underline /><AlignLeft /><Link2 /><MessageSquare /><ListFilter /></div>
          <div className="sheets-formula"><span>{cell}<ChevronDown size={9} /></span><i>ƒx</i><span>{cellValue}</span></div>
          <div className="sheets-grid"><table><thead><tr><th /><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th></tr></thead><tbody><tr className="sheets-column-labels"><th>1</th>{['Company','Category','Price','Security','Status'].map(title => <td key={title}>{title}<ChevronDown size={8} /></td>)}</tr>{Array.from({length:8},(_,index) => <tr key={index}><th>{index+2}</th>{Array.from({length:5},(_,column) => { const address = `${String.fromCharCode(65+column)}${index+2}`; return <td key={column} className={index < rows && index < 3 ? `${cell === address ? 'selected-cell' : ''} ${column === 4 ? 'status-cell' : ''}` : ''} onClick={index < 3 ? () => { inspect(); setCell(address) } : undefined}>{index < rows && index < 3 ? <span>{vendors[index][column]}</span> : ''}</td> })}</tr>)}</tbody></table></div>
          <div className="sheets-bottom"><Plus size={11} /><Menu size={11} /><span>Comparison <ChevronDown size={10} /></span><small>All changes saved</small></div>
          {time > 4.8 && <div className="work-handoff-receipt"><span className="handoff-avatar">N</span><div><strong>Noura’s agent received the shortlist</strong><small>3 vendors · requirements · source links</small></div><Check size={13} /></div>}
          <AgentCursor name="Rashid’s agent" x={time > 2.4 ? '59%' : '34%'} y={time > 2.4 ? '52%' : '35%'} visible={true} />
        </div>}
        {step === 2 && <div className="work-gmail">
          <header><Menu size={15} /><AppIcon name="gmail.svg" /><strong>Gmail</strong><span><Search size={12} />Search mail<Settings2 size={12} /></span><span className="work-profile">N</span></header>
          <aside><div className="gmail-compose"><Pencil size={12} />Compose</div><span>Inbox <small>12</small></span><span>Starred</span><span>Snoozed</span><span>Sent</span><b>Drafts <small>1</small></b><span>More</span><strong>Labels <Plus size={10} /></strong><span>Work</span></aside>
          <div className="gmail-inbox"><div>□　⌄　↻　⋮</div>{['Noura　　Vendor comparison','Omar　　Re: onboarding requirements','Team　　Weekly planning notes','me　　Updated security checklist','Noura　　Re: customer research'].map(line => <p key={line}>□　☆　{line}</p>)}</div>
          <div className="gmail-draft"><div className="gmail-draft-title">New Message<span><Minus size={10} /><Maximize2 size={9} /><X size={10} /></span></div><div className="gmail-recipient">To <span>Noura &lt;noura@example.com&gt;</span><small>Cc Bcc</small></div><div className="gmail-subject">Onboarding tools — shortlist for review</div><div className="gmail-body">{text}<span className={text.length < draft.length ? 'gmail-caret' : ''} /></div><div className="gmail-attachment"><AppIcon name="google-sheets.webp" />Vendor shortlist <span>Google Sheets</span></div><div className="gmail-send-tools"><span className="gmail-send-label">Send <ChevronDown size={10} /></span><Underline size={12} /><Paperclip size={13} /><Link2 size={12} /><MoreHorizontal size={12} /><Trash2 size={12} /></div></div>
          {time > 5.2 && <button className="work-review-pill" onClick={() => { inspect(); setReviewing(value => !value) }}><LockKeyhole size={11} />{reviewing ? 'Draft held for Noura — nothing sent' : 'Waiting for Noura’s review'}<ChevronRight size={12} /></button>}
          <AgentCursor name="Noura’s agent" x="74%" y={time > 5 ? '80%' : '54%'} visible={time > 1} />
        </div>}
      </div>
    </div>
    <button className="work-activity-toggle" aria-expanded={activityOpen} aria-controls="work-activity-log" onClick={() => { inspect(); setActivityOpen(value => !value) }}><Clock3 size={12} /><span>{step === 0 ? 'Researching the options' : step === 1 ? 'Passing the shortlist to Noura’s agent' : 'Draft saved. Noura decides what goes out.'}</span><small>Activity</small><ChevronDown size={12} /></button>
    {activityOpen && <div className="work-activity-log" id="work-activity-log">{actions.map(([at,name,title,detail],index) => <details key={at}><summary><time>{at}</time><span><strong>{title}</strong><small>{name}</small></span>{index <= step ? <Check size={12} /> : <Clock3 size={12} />}</summary><p>{detail}</p></details>)}</div>}
  </div>
}
