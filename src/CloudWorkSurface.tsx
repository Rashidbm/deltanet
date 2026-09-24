import { motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronRight, FileText, LockKeyhole, MousePointer2, RotateCw } from 'lucide-react'
import './CloudWorkSurface.css'

/** A cropped GitHub job-log view, grounded in GitHub Docs. Sample task data. */
export function CloudWorkSurface({ step, playing }: { step: number; playing: boolean }) {
  const reduced = !!useReducedMotion()
  const brief = step === 2
  return <div className="cloud-desktop" data-step={step} data-playing={playing}>
    <div className="cloud-desktop-caption"><span>DELTANET CLOUD</span><span>Rashid’s agent · Remote workspace</span></div>
    <div className="cloud-browser">
      <div className="cloud-browser-tabs" aria-hidden="true"><div className="mac-window-controls"><i /><i /><i /></div><div className={!brief ? 'is-current' : ''}><img src="/apps/github.svg" alt="" />Release checks</div><div className={brief ? 'is-current' : ''}><img className="delta-tab-icon" src="/logo-options/split-delta.svg" alt="" />Morning brief</div></div>
      <div className="cloud-browser-address" aria-hidden="true"><ArrowLeft size={12} /><ArrowRight size={12} /><RotateCw size={11} /><span><LockKeyhole size={10} />{brief ? 'DeltaNet / Workspace / Release brief' : 'github.com / checkout / actions'}</span></div>
      <div className="cloud-browser-viewport">
        <motion.div className="cloud-job-view" animate={{opacity:brief ? 0 : 1,transform:brief && !reduced ? 'translateY(-6px)' : 'translateY(0px)'}} transition={{duration:reduced ? 0 : .22}} aria-hidden={brief}>
          <header><div><img src="/apps/github.svg" alt="GitHub" /><span>checkout <b>/</b> Actions</span></div><span>#482</span></header>
          <div className="cloud-job-title"><h3>release-checks</h3><p>{step === 0 ? 'In progress' : 'Completed successfully'} <span>· main</span></p></div>
          <div className="cloud-job-row"><ChevronRight size={12} /><Check size={13} /><span>Set up job</span><small>2s</small></div>
          <div className="cloud-job-row"><ChevronRight size={12} /><Check size={13} /><span>Checkout code</span><small>1s</small></div>
          <div className={`cloud-job-row cloud-test-row ${step > 0 ? 'is-expanded' : ''}`}><ChevronDown size={12} />{step === 0 ? <span className="cloud-job-spinner" /> : <Check size={13} />}<span>Run payment checks</span><small>{step === 0 ? 'Running' : '18s'}</small></div>
          <div className="cloud-job-log"><div><span>1</span><code>$ npm run test:checkout</code></div><div aria-hidden={step === 0} className={step > 0 ? 'is-visible' : ''}><span>2</span><code>✓ New-card payment passed</code></div><div aria-hidden={step === 0} className={step > 0 ? 'is-visible' : ''}><span>3</span><code>✓ Saved-card payment passed</code></div><div aria-hidden={step === 0} className={step > 0 ? 'is-visible' : ''}><span>4</span><code>2 passed · Release checks complete</code></div></div>
        </motion.div>
        <motion.div className="cloud-brief-view" animate={{opacity:brief ? 1 : 0,transform:!brief && !reduced ? 'translateY(6px)' : 'translateY(0px)'}} transition={{duration:reduced ? 0 : .28}} aria-hidden={!brief}>
          <header><FileText size={13} />Release brief<span><Check size={10} /> Saved</span></header>
          <article><span className="cloud-brief-date">FRIDAY · 8:00 AM</span><h3>Ready for the day.</h3><p>The checkout release passed both payment checks.</p><div className="cloud-brief-evidence"><img src="/apps/github.svg" alt="GitHub" /><span>release-checks #482</span><Check size={11} /></div><div className="cloud-brief-decision"><span>N</span><div><strong>One decision for Noura</strong><p>Review the customer update before it goes out.</p></div></div><footer><LockKeyhole size={10} /> Shared task context · Private chats stay private</footer></article>
        </motion.div>
        <motion.div className="cloud-agent-pointer" aria-hidden="true" animate={{left:brief ? '62%' : step === 0 ? '65%' : '59%',top:brief ? '68%' : step === 0 ? '49%' : '72%',opacity:reduced ? 0 : 1}} transition={{duration:.75,ease:[.65,0,.25,1]}}><MousePointer2 size={21} fill="#e4e4ea" stroke="#242429" strokeWidth={1.4} /><span>Rashid’s agent</span></motion.div>
      </div>
    </div>
    <div className="cloud-desktop-task"><span className="cloud-task-indicator">{brief ? <Check size={11} /> : <span />}</span><span>{brief ? 'Brief saved to your workspace' : step === 0 ? 'Opening the release checks' : 'Reading the verification results'}</span><span>{brief ? 'Complete' : 'Working'}</span></div>
  </div>
}
