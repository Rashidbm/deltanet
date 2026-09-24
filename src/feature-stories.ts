export type FeatureId = 'context' | 'skills' | 'coordination'
export type StoryMessage = { role: 'user' | 'assistant'; at: number; text: string }
export const STORY_DURATION = 16
export const features: { id: FeatureId; title: string; description: string; caption: string; messages: StoryMessage[] }[] = [
  { id: 'context', title: 'Shared context', description: 'The right brief reaches the right agent. Your private conversation stays yours.', caption: 'One brief. No second briefing.', messages: [
    { role: 'user', at: 2, text: 'Bring Omar up to speed on the checkout failure.' },
    { role: 'assistant', at: 3.2, text: 'I found the release thread, incident brief, and runbook. Share those with his agent?' },
    { role: 'user', at: 7.6, text: 'Yes, send him the brief.' },
    { role: 'assistant', at: 10.2, text: 'Done. His agent has the brief and sources. Omar can pick up the investigation.' },
  ] },
  { id: 'skills', title: 'Shared skills', description: 'Give your agents the procedures your team trusts. Define them once, use them together.', caption: 'Your way of working, shared.', messages: [
    { role: 'user', at: 2, text: 'Use our incident response skill for this.' },
    { role: 'assistant', at: 3.2, text: 'I’ll share it with Omar and Noura’s agents. Omar verifies recovery; Noura prepares the customer update.' },
    { role: 'user', at: 7.6, text: 'Have Noura wait for verification.' },
    { role: 'assistant', at: 10.2, text: 'Included. Both agents are using the same procedure, with verification before the update.' },
  ] },
  { id: 'coordination', title: 'Agent coordination', description: 'Let agents handle the handoffs. Bring people in when a decision needs them.', caption: 'The handoff happens for you.', messages: [
    { role: 'user', at: 2, text: 'Ask Omar to confirm recovery before Noura sends the update.' },
    { role: 'assistant', at: 3.2, text: 'Omar’s agent has the request. I’ll pass the verified result to Noura.' },
    { role: 'user', at: 7.6, text: 'Let me know when it’s sent.' },
    { role: 'assistant', at: 12, text: 'Omar verified checkout. Noura approved the update, and her agent sent it.' },
  ] },
]
export function visibleStoryText(message: StoryMessage, time: number) {
  if (time < message.at) return ''
  if (message.role === 'user') return message.text
  return message.text.split(' ').slice(0, Math.max(0, Math.floor((time - message.at) * 16))).join(' ')
}
export function storyActivity(feature: FeatureId, time: number) {
  if (time < 2) return 'Your agent is ready'
  if (feature === 'context') return time < 5 ? 'Reading connected sources' : time < 7.6 ? 'Waiting for your approval' : time < 10.2 ? 'Sharing with Omar’s agent' : 'Context received by Omar’s agent'
  if (feature === 'skills') return time < 5 ? 'Loading Incident response' : time < 7.6 ? 'Preparing the shared workflow' : time < 10.2 ? 'Adding the verification step' : 'Both agents have the same skill'
  return time < 5 ? 'Sending to Omar’s agent' : time < 8.8 ? 'Omar is verifying recovery' : time < 11.2 ? 'Noura is reviewing the update' : time < 12 ? 'Sending the approved update' : 'Update sent · task complete'
}
