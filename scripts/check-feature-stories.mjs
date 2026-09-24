import assert from 'node:assert/strict'
import { features, STORY_DURATION, visibleStoryText, storyActivity } from '../src/feature-stories.ts'
for (const feature of features) {
  for (let index = 0; index < feature.messages.length; index++) {
    const message = feature.messages[index]
    assert.equal(visibleStoryText(message, message.at - .01), '', 'No future conversation text leaks into a scene')
    const finish = message.at + (message.role === 'assistant' ? message.text.split(' ').length / 16 + .01 : 0)
    assert.equal(visibleStoryText(message, finish), message.text)
    const next = feature.messages[index + 1]
    if (next) assert.ok(finish < next.at - (next.role === 'user' ? 1.7 : 0), 'Leave time to read before the next draft starts')
    else assert.ok(finish <= STORY_DURATION - 2, 'Hold the complete outcome for at least two seconds')
  }
}
assert.equal(storyActivity('context', 7), 'Waiting for your approval')
assert.equal(storyActivity('context', 8), 'Sharing with Omar’s agent')
assert.equal(storyActivity('coordination', 10), 'Noura is reviewing the update')
assert.equal(storyActivity('coordination', 11.5), 'Sending the approved update')
console.log('Feature stories passed: no early text, readable turn timing, complete final holds, approval before sharing/sending.')
