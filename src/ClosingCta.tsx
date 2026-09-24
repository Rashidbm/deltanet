import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useReducedMotion } from 'motion/react'
import { ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { HeroBackdrop } from './HeroBackdrop'
import './ClosingCta.css'

export function ClosingCta() {
  const reduced = !!useReducedMotion()
  const input = useRef<HTMLInputElement>(null)
  const mac = /Mac|iPhone|iPad/.test(navigator.platform)
  useEffect(() => {
    const focusSignup = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k' || event.altKey) return
      const target = event.target
      if (target instanceof HTMLElement && (target.matches('input, textarea') || target.isContentEditable)) return
      event.preventDefault()
      document.getElementById('join')?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'center' })
      input.current?.focus({ preventScroll: true })
    }
    window.addEventListener('keydown', focusSignup)
    return () => window.removeEventListener('keydown', focusSignup)
  }, [reduced])
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (state === 'sending' || state === 'success') return
    setState('sending')
    try {
      const response = await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      if (!response.ok || !(await response.json()).ok) throw new Error('Signup failed')
      setState('success')
    } catch { setState('error') }
  }
  return <section id="join" className="closing-cta" aria-labelledby="closing-heading">
    <HeroBackdrop reduced={reduced} />
    <div className="section-boundary closing-layout"><div className="closing-copy">
      <p className="proof-overline">YOUR PEOPLE. THEIR AGENTS. ONE TEAM.</p>
      <h2 id="closing-heading">Keep your team moving.<br /><span>Stay in the loop.</span></h2>
      <p>Your agent works with your teammates’ agents.<br />You get the progress—and the decisions that need you.</p>
      <form className="closing-signup" onSubmit={submit} aria-label="Join the DeltaNet waitlist">
        <label htmlFor="waitlist-email" className="sr-only">Email address</label>
        <div className="signup-email-field"><kbd aria-hidden="true">{mac ? '⌘ K' : 'Ctrl K'}</kbd><Input ref={input} id="waitlist-email" type="email" name="email" autoComplete="email" placeholder="Your email address" required maxLength={254} value={email} onChange={event => { setEmail(event.target.value); if(state === 'error') setState('idle') }} disabled={state === 'sending' || state === 'success'} aria-describedby="waitlist-status" aria-keyshortcuts={mac ? 'Meta+K' : 'Control+K'} /></div>
        <Button type="submit" className="closing-primary" disabled={state === 'sending' || state === 'success'}>{state === 'success' ? <>You’re on the list <Check size={15} /></> : state === 'sending' ? 'Joining…' : <>Get early access <ArrowRight size={15} /></>}</Button>
      </form>
      <p id="waitlist-status" className={`closing-note ${state === 'error' ? 'signup-error' : ''}`} role="status">{state === 'success' ? 'Thanks. We’ll email you when early access opens.' : state === 'error' ? 'Couldn’t save your email. Please try again.' : 'Join the waitlist for an early access invitation.'}</p>
    </div></div>
  </section>
}
