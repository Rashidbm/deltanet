export type FeatureId = 'context' | 'skills' | 'coordination'
export type StoryMessage = { role: 'user' | 'assistant'; at: number; text: string }
export const STORY_DURATION = 40
export const features: { id: FeatureId; title: string; description: string; caption: string; messages: StoryMessage[] }[] = [
  { id: 'context', title: 'Shared context', description: 'The right brief reaches the right agent. Your private conversation stays yours.', caption: 'One brief. No second briefing.', messages: [
    { role: 'user', at: 6, text: 'Bring Omar up to speed on the checkout failure.' },
    { role: 'assistant', at: 8.2, text: 'I found the incident, release thread, and runbook. Share them with his agent?' },
    { role: 'user', at: 29, text: 'Yes. Include what we’ve tried.' },
    { role: 'assistant', at: 31.2, text: 'Sent. Omar has the brief and sources, with your latest notes.' },
  ] },
  { id: 'skills', title: 'Shared skills', description: 'Give your agents the procedures your team trusts. Define them once, use them together.', caption: 'Your way of working, shared.', messages: [
    { role: 'user', at: 6, text: 'Use our incident-response skill for this.' },
    { role: 'assistant', at: 8.2, text: 'I’ll give Omar and Noura’s agents the same procedure.' },
    { role: 'user', at: 29, text: 'Wait for verification before sending.' },
    { role: 'assistant', at: 31.2, text: 'Added. Verify first, then review the customer update. Both agents have the same skill.' },
  ] },
  { id: 'coordination', title: 'Agent coordination', description: 'Let agents handle the handoffs. Bring people in when a decision needs them.', caption: 'The handoff happens for you.', messages: [
    { role: 'user', at: 6, text: 'Ask Omar to verify the fix before Noura sends the update.' },
    { role: 'assistant', at: 8.2, text: 'On it. I’ll pass the verified result to Noura’s agent.' },
    { role: 'user', at: 29, text: 'Let me know when it’s sent.' },
    { role: 'assistant', at: 31.2, text: 'Omar confirmed recovery. Noura approved the update, and her agent sent it.' },
  ] },
]
