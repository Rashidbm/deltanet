# Feature videos

Three silent 24-second product clips, 786 × 1704, 30 fps. The actual sourced iPhone bezel is rendered by the site; the videos contain the screen only.

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
npx hyperframes@0.8.73 render video-source/phone/context --fps 30 --quality high --output public/videos/context.mp4
```

Repeat check and render with `skills` and `coordination`. Poster images are extracted at 21 seconds with ffmpeg. `build.mjs` assembles deterministic paused GSAP timelines, copies all required local assets and emits the three standalone compositions. There are no render-time network dependencies or clocks. The task sheet intentionally covers the composer; layout annotations mark that native overlay.

The website's HTML video element owns playback. Evidence cards follow `currentTime`. Offscreen and hidden-tab videos pause. Reduced motion opens the final frame and allows explicit playback. Tabs mount only the selected clip. A transcript remains available if video cannot load.
