/** Fictional presentation only. State is a pure function of time; no external actions. */
export type Worker = 'rashid' | 'omar' | 'noura'
export type Turn = { id: string; from: 'user' | 'assistant'; text: string; start: number; duration: number; send?: number }
export type Scene = { id: string; worker: Worker; name: string; fullName: string; role: string; title: string; start: number; end: number; apps: string[]; turns: Turn[] }
export const DURATION = 40
export const sharedSkill = { id: 'incident-response', name: 'Incident response', version: '1.0', steps: ['Investigate', 'Verify recovery', 'Customer update'], href: '/demo/skills/incident-response/SKILL.md' }
export const scenes: Scene[] = [
  { id: 'request', worker: 'rashid', name: 'Rashid', fullName: 'Rashid', role: 'Private workspace', title: 'Checkout incident', start: 0, end: 10,
    apps: ['google-drive', 'slack', 'linear'], turns: [
      { id: 'r1', from: 'user', text: 'Checkout’s failing. Can you get Omar on it?', start: .3, duration: 1.7, send: 2.2 },
      { id: 'r2', from: 'assistant', text: 'I’ll loop in Omar and Noura. Hold the customer update until the fix is verified?', start: 2.8, duration: 1 },
      { id: 'r3', from: 'user', text: 'Yes, let’s do that.', start: 5, duration: .9, send: 6.1 },
      { id: 'r4', from: 'assistant', text: 'On it. They’ll have the incident context and our response workflow.', start: 7.3, duration: 1 },
    ] },
  { id: 'engineering', worker: 'omar', name: 'Omar', fullName: 'Omar Alharbi', role: 'Engineering', title: 'Review checkout fix', start: 10, end: 23,
    apps: ['github', 'linear', 'google-drive'], turns: [
      { id: 'o1', from: 'assistant', text: 'Rashid flagged checkout failures. I traced it to tax rounding. The fix is ready for review.', start: .8, duration: 1 },
      { id: 'o2', from: 'user', text: 'Is the rounding edge case covered?', start: 3.1, duration: 1.2, send: 4.5 },
      { id: 'o3', from: 'assistant', text: 'Yes. The test fails on the old code and passes with the fix.', start: 4.9, duration: 1 },
      { id: 'o4', from: 'user', text: 'Deploy it, then verify checkout.', start: 7, duration: 1.1, send: 8.3 },
    ] },
  { id: 'customers', worker: 'noura', name: 'Noura', fullName: 'Noura Alqahtani', role: 'Customer Success', title: 'Customer checkout update', start: 23, end: 35,
    apps: ['gmail', 'hubspot', 'linear'], turns: [
      { id: 'n1', from: 'assistant', text: 'Omar verified the fix. Your update is ready for the 23 affected accounts.', start: .8, duration: 1 },
      { id: 'n2', from: 'user', text: 'Skip the technical details. Just say they can retry.', start: 3, duration: 1.5, send: 4.7 },
      { id: 'n3', from: 'assistant', text: 'Done. Take a look.', start: 5.1, duration: .5 },
      { id: 'n4', from: 'user', text: 'Perfect, send it.', start: 7.3, duration: .7, send: 8.2 },
      { id: 'n5', from: 'assistant', text: 'Sent. Rashid’s agent has the update.', start: 10.8, duration: .5 },
    ] },
  { id: 'result', worker: 'rashid', name: 'Rashid', fullName: 'Rashid', role: 'Private workspace', title: 'Checkout incident', start: 35, end: DURATION,
    apps: ['linear', 'gmail', 'google-drive'], turns: [
      { id: 'f1', from: 'assistant', text: 'Checkout is back. Omar verified the fix, and Noura notified all 23 affected accounts.', start: .8, duration: 1 },
    ] },
]
export const handoffs = [
  { id: 'to-omar', scene: 'request', after: 'r3', sender: 'Rashid', recipient: 'Omar', tone: 'omar', start: 6.1, end: 7.3, brief: 'Investigate the checkout failures. Review the fix and verify a production checkout before reporting recovery.', context: 'Release details · Incident runbook', apps: ['slack', 'google-drive'] },
  { id: 'to-noura', scene: 'request', after: 'r3', sender: 'Rashid', recipient: 'Noura', tone: 'noura', start: 6.1, end: 7.3, brief: 'Prepare the customer update. Hold it until Engineering verifies recovery, then bring it to Noura for review.', context: 'Incident summary · Wait for verified recovery', apps: ['linear', 'google-drive'] },
  { id: 'recovery-to-noura', scene: 'engineering', after: 'o4', sender: 'Omar', recipient: 'Noura', tone: 'noura', start: 20.4, end: 21.8, brief: 'The approved fix is deployed. Production checkout passed. Verification is recorded in ENG-241; the customer update can now be reviewed.', context: 'Verified checkout result · ENG-241', apps: ['linear'] },
  { id: 'result-to-rashid', scene: 'customers', after: 'n4', sender: 'Noura', recipient: 'Rashid', tone: 'rashid', start: 32.3, end: 33.6, brief: 'Noura approved the revised draft. The customer update was sent to contacts at all 23 affected accounts.', context: 'Customer update sent · 23 affected accounts', apps: ['gmail', 'hubspot'] },
]
export type Activity = { at: number; kind: 'ready' | 'working' | 'sharing' | 'received' | 'review' | 'complete'; title: string; detail: string; apps: string[] }
export const activities: Activity[] = [
  { at: 0, kind: 'ready', title: 'Your agent is ready', detail: 'Connected to your work', apps: [] },
  { at: 2.2, kind: 'working', title: 'Gathering incident context', detail: 'Reading the release thread and runbook', apps: ['slack', 'google-drive'] },
  { at: 6.1, kind: 'sharing', title: 'Sending to Omar and Noura’s agents', detail: 'Task context + Incident response skill', apps: ['slack', 'google-drive'] },
  { at: 7.3, kind: 'received', title: 'Context and skill received', detail: 'Both agents are working from the same brief', apps: ['linear', 'google-drive'] },
  { at: 10, kind: 'received', title: 'Received from Rashid’s agent', detail: 'Incident context + response workflow', apps: ['slack', 'google-drive'] },
  { at: 12, kind: 'review', title: 'Fix ready for your review', detail: 'PR #482 · Regression test included', apps: ['github'] },
  { at: 14.5, kind: 'working', title: 'Checking regression coverage', detail: 'Comparing the old code with the patch', apps: ['github'] },
  { at: 15.5, kind: 'review', title: 'Regression test confirmed', detail: 'Waiting for your deployment approval', apps: ['github'] },
  { at: 18.3, kind: 'working', title: 'Deploying the approved fix', detail: 'Incident response · Verify recovery', apps: ['github'] },
  { at: 19.3, kind: 'working', title: 'Verifying production checkout', detail: 'Recording the result in ENG-241', apps: ['linear'] },
  { at: 20.4, kind: 'sharing', title: 'Sending verification to Noura’s agent', detail: 'Checkout passed · Customer update unlocked', apps: ['linear'] },
  { at: 21.8, kind: 'received', title: 'Noura’s agent received verification', detail: 'The customer update is ready for review', apps: ['linear'] },
  { at: 23, kind: 'received', title: 'Received from Omar’s agent', detail: 'Verified recovery · ENG-241', apps: ['linear'] },
  { at: 25, kind: 'review', title: 'Customer update ready for review', detail: 'Incident response · Customer update', apps: ['gmail', 'hubspot'] },
  { at: 27.7, kind: 'working', title: 'Simplifying the draft', detail: 'Removing technical details', apps: ['gmail'] },
  { at: 28.2, kind: 'review', title: 'Revised draft ready', detail: 'Waiting for your approval to send', apps: ['gmail'] },
  { at: 31.2, kind: 'working', title: 'Sending the approved update', detail: 'Contacts at 23 affected accounts', apps: ['gmail', 'hubspot'] },
  { at: 32.3, kind: 'sharing', title: 'Sending the outcome to Rashid’s agent', detail: '23 accounts notified', apps: ['gmail'] },
  { at: 33.6, kind: 'received', title: 'Rashid’s agent received the outcome', detail: 'Customer notification confirmed', apps: ['gmail'] },
  { at: 35, kind: 'complete', title: 'Incident resolved', detail: 'Checkout restored · 23 accounts notified', apps: ['linear', 'gmail'] },
]
export function frameAt(seconds: number) {
  const time = Math.max(0, Math.min(DURATION, Number.isFinite(seconds) ? seconds : 0))
  const scene = scenes.find(item => time < item.end) ?? scenes[scenes.length - 1]
  const local = Math.round((time - scene.start) * 1e6) / 1e6
  const prior = scene.id === 'result' ? scenes[0].turns.slice(-2).map(turn => ({ ...turn, visibleText: turn.text, complete: true })) : []
  const messages = [...prior, ...scene.turns.flatMap(turn => {
    if (turn.from === 'user') return local >= turn.send! ? [{ ...turn, visibleText: turn.text, complete: true }] : []
    if (local < turn.start) return []
    const words = turn.text.split(' ')
    const streamDuration = words.length / 22
    const progress = Math.min(1, (local - turn.start) / streamDuration)
    return [{ ...turn, visibleText: words.slice(0, Math.max(1, Math.ceil(words.length * progress))).join(' '), complete: progress >= 1 }]
  })]
  const composing = scene.turns.find(turn => turn.from === 'user' && local >= turn.start && local < turn.send!)
  const draft = composing ? composing.text.slice(0, Math.floor(composing.text.length * Math.min(1, (local - composing.start) / composing.duration))) : ''
  const waiting = scene.turns.find((turn, index) => turn.from === 'assistant' && local < turn.start && (index === 0 ? local >= .2 : local >= (scene.turns[index - 1].send ?? Infinity)))
  const transfers = handoffs.filter(item => item.scene === scene.id && time >= item.start).map(item => ({ ...item, received: time >= item.end }))
  const activity = [...activities].reverse().find(item => time >= item.at)!
  const sharedContext = handoffs.filter(item => time >= item.start && (item.sender === scene.name || item.recipient === scene.name)).map(item => ({ ...item, received: time >= item.end }))
  const state = { activity, sharedContext, time, scene, local, messages, draft, composing: !!composing, waiting: !!waiting,
    transfers, transferring: transfers.some(item => !item.received),
    patchReady: time >= 10.8, approved: time >= 18.3, recovered: time >= 20.4, revised: time >= 28.1, sent: time >= 32.3, resolved: time >= 35,
    contextVisible: time >= 6.1, skill: sharedSkill, skillStep: time < 10 ? 0 : time < 23 ? 1 : 2 }
  // The presentation clock runs independently. The expensive workspace only renders
  // when its visible content changes, not on every animation frame.
  const visualKey = JSON.stringify([scene.id, activity.at, sharedContext.map(item => [item.id, item.received]), draft, messages.map(item => [item.id, item.visibleText, item.complete]),
    state.waiting, transfers.map(item => [item.id, item.received]), state.patchReady, state.approved,
    state.recovered, state.revised, state.sent, state.resolved, Math.floor(local)])
  return { ...state, visualKey }
}
export type Frame = ReturnType<typeof frameAt>
