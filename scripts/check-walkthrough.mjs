import assert from 'node:assert/strict'
import { frameAt, scenes, DURATION, handoffs } from '../src/walkthrough.ts'
// An authored user turn must finish typing before entering the conversation.
for (const scene of scenes) {
  for (const turn of scene.turns) {
    if (turn.from !== 'user') continue
    assert.ok(turn.send >= turn.start + turn.duration)
    const before = frameAt(scene.start + turn.send - .01)
    assert.equal(before.messages.some(message => message.id === turn.id), false)
    assert.equal(before.draft, turn.text)
    const after = frameAt(scene.start + turn.send)
    assert.equal(after.messages.find(message => message.id === turn.id)?.visibleText, turn.text)
    assert.equal(after.draft, '')
  }
}
for (let t = 0; t <= DURATION; t += .05) {
  const frame = frameAt(t)
  assert.ok(!frame.sent || frame.recovered, 'Customer update cannot precede verified recovery')
  assert.ok(!frame.recovered || frame.approved, 'Verification must follow engineering approval')
  assert.ok(!frame.resolved || frame.sent, 'Final receipt must follow customer notification')
  const permittedIds = new Set(frame.scene.turns.map(turn => turn.id))
  if (frame.scene.id === 'result') scenes[0].turns.forEach(turn => permittedIds.add(turn.id))
  assert.ok(frame.messages.every(message => permittedIds.has(message.id)), 'Private threads cannot leak across perspectives')
  assert.deepEqual(frame, frameAt(t), 'Scrubbing must be deterministic')
}
assert.equal(frameAt(DURATION).scene.id, 'result')
console.log('Timeline checks passed: typing/send, event order, private perspectives, deterministic seeking.')

for (const handoff of handoffs) {
  assert.equal(frameAt(handoff.start - .01).transfers.some(item => item.id === handoff.id), false)
  assert.equal(frameAt(handoff.start).transfers.find(item => item.id === handoff.id)?.received, false)
  assert.equal(frameAt(handoff.end).transfers.find(item => item.id === handoff.id)?.received, true)
}
console.log('Handoff states checked: no early disclosure, sending, then receipt.')

for (let time = 0; time <= DURATION; time += .1) {
  const frame = frameAt(time)
  assert.ok(frame.activity.at <= time)
  assert.ok(frame.sharedContext.every(item => item.sender === frame.scene.name || item.recipient === frame.scene.name), 'Only this worker’s context exchanges belong in their activity details')
  if (frame.activity.kind === 'sharing') assert.ok(frame.transferring, 'Sharing status must coincide with an active transfer')
}
console.log('Activity states and per-worker context visibility checked.')

// Shared procedure is stable across private perspectives; stage changes are not new skills.
const engineering = frameAt(19)
const customer = frameAt(29)
assert.equal(engineering.skill.id, customer.skill.id)
assert.equal(engineering.skill.version, customer.skill.version)
assert.equal(engineering.skill.steps[engineering.skillStep], 'Verify recovery')
assert.equal(customer.skill.steps[customer.skillStep], 'Customer update')
assert.equal(frameAt(6).contextVisible, false)
assert.equal(frameAt(6.1).contextVisible, true)
for (const scene of scenes) {
  const last = scene.turns.at(-1)
  const finish = last.from === 'user' ? last.send : last.start + last.text.split(' ').length / 22
  assert.ok(scene.end - scene.start - finish >= .8, 'Each perspective needs a reading hold before transition')
}
console.log('Shared skill reuse, automatic context reveal, and final reading holds checked.')
