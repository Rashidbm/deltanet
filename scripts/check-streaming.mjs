import assert from 'node:assert/strict'
import { frameAt, scenes } from '../src/walkthrough.ts'
// Exercise the actual reveal path, measuring gaps between newly rendered words.
let maximumGap = 0
for (const scene of scenes) for (const turn of scene.turns) {
  if (turn.from !== 'assistant') continue
  let lastWords = 0, lastChange = turn.start
  for (let ms = 0; ms <= 3500; ms += 5) {
    const local = turn.start + ms / 1000
    const message = frameAt(scene.start + local).messages.find(item => item.id === turn.id)
    if (!message) continue
    const words = message.visibleText.split(' ').length
    if (words > lastWords) {
      if (lastWords > 0) maximumGap = Math.max(maximumGap, local - lastChange)
      lastChange = local; lastWords = words
    }
    if (message.complete) break
  }
}
console.log(`Longest scripted gap between response words: ${Math.round(maximumGap * 1000)} ms`)
assert.ok(maximumGap <= .08, 'Response words should arrive continuously, without the old 150–230 ms pauses')
