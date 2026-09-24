# Feature videos

Three silent 40-second product tours, 1040 × 1304, 30 fps. The sourced iPhone bezel and its screen move together inside the video. Camera close-ups follow the composer, reply, task details, approval and result before returning to the full device.

## References

- DeltaNet's original `agent-handoff` prototype: device geometry, ChatGPT-style navigation, composer and native sheet treatment.
- https://x.com/0xDesigner/status/2092635269081989572: persistent conversation plus compact tasks control and task-details expansion. The original clip and its content are not embedded or redistributed.
- Existing sourced Apple SF Symbols: `public/device/icons/` (see repository asset sources).

No generated images or audio. Text is fictional demo data. Native system typography is intentional to match the approved iPhone reference.

## Rebuild from the repository root

```sh
npm ci --prefix video-source/phone
node video-source/phone/build.mjs
npx hyperframes@0.8.73 check video-source/phone/context
npx hyperframes@0.8.73 render video-source/phone/context --fps 30 --quality high --output public/videos/context-tour.mp4
```

Repeat check and render with `skills` and `coordination`. Poster images are extracted at 39 seconds with ffmpeg. `build.mjs` assembles deterministic paused GSAP timelines, copies all required local assets and emits the three standalone compositions. There are no render-time network dependencies or clocks. The task sheet intentionally covers the composer; layout annotations mark that native overlay.

The website's HTML video element owns playback. Evidence cards, chapter captions and the scrubber follow `currentTime`. Five chapter buttons seek and pause at readable moments (4, 11, 21, 34.5 and 39 seconds). Camera moves use eased 1–1.8 second transitions, and the task details hold open for 8.5 seconds. Offscreen and hidden-tab videos pause. Reduced motion opens the final frame and allows explicit playback. Tabs mount only the selected clip. A transcript remains available if video cannot load.
