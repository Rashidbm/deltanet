# DeltaNet desktop workspace prototype

A populated software scene for the future landing-page hero. The phone demo remains a separate, unchanged middle-page component.

## Run

From this directory: `npm install`, then `npm run dev`.
Open http://127.0.0.1:4320/. Vite binds only to loopback on strict port 4320.

## Current walkthrough

A 40-second fictional incident plays through four separate private workspaces: Rashid's request, Omar's engineering review, Noura's customer wording review, then the result back in Rashid's thread. Human messages type into the composer before sending; agent replies stream by word with reading holds. Omar asks about regression coverage. Noura requests a simpler draft, which visibly updates beside her conversation before she approves sending it.

The perspective bar and optional review chapters are outside the software frame: marketing playback controls, not a product feature for accessing someone else's private chat. Each person's agent shares a small task receipt. No private messages cross between the workers' threads.

The right panel automatically reveals the scoped task context and shared skill during Rashid’s handoff, then uses the researched Linear issue anatomy and a plainly labeled email preview in the other private views. It is not an embedded third-party app. Existing Google Drive, Slack, GitHub, Linear, Gmail, HubSpot and Notion SVGs remain; none are generated.

## Interactions

- Play/pause and replay. Add `?review=1` to show chapters and timeline scrubbing.
- `?t=33` opens a deterministic paused checkpoint for review.
- Reduced-motion preference opens the completed result without autoplay.
- Background tabs suspend the presentation clock.
- Expand scoped coordination receipts, source documents, issue preview and connections.
- Selecting a source or typing in the composer pauses playback for inspection.
- The actual AI Elements composer grows only as text wraps; manual messages get a clearly local prototype reply.

No backend or live model. No real account access, sending, deployment or authorization changes. Statuses, content and permissions language illustrate intended behavior, not implemented backend guarantees. State is local to the tab.

## Verification

Run `node scripts/check-walkthrough.mjs` for typing/send boundaries, event ordering, per-person thread isolation and deterministic seeking.

TypeScript and production build passed. Lint has zero errors and pre-existing warnings in installed upstream components. Browser checks covered connector search, Drive source, all seven logos, the shared-message disclosure, replay completion, issue expansion, local comments, sidebar collapse/restore and composer sizing. Layout was checked at 1280px, the user's 606px panel and 390 CSS pixels with the browser's existing zoom preserved. No horizontal document overflow. Viewport override reset afterward. Browser error log was empty after a fresh reload.

See SOURCES.md and ../../docs/research/hero-work-surface-references.md for exact component provenance, inspected official screenshots and the boundary between sourced UI and fictional data.

Motion/dialogue evidence: ../../docs/research/hero-dialogue-motion-references.md.

Transitions now keep navigation anchored and expand content panels using timing/easing measured from Dock’s rendered styles. Incoming work previews reveal after the conversation panel starts opening.

## Streaming and handoff revision

The old timeline spread a short response across its full reading window, leaving up to 235 ms between words. Response rendering now streams at 22 words/second (measured maximum scripted gap: 50 ms), with a brief opacity entrance only for new words. Completed words remain stable. Reading holds are separate from token delivery. The workspace is memoized by visible state, so the presentation clock no longer renders the entire workspace on every frame.

A fixed Agent activity area above the composer shows the current phase, recipient, source context and receipt. Status changes animate within the same reserved space. The Shared context button opens the exact fictional task brief and included context; transfer statuses no longer create chat rows. Replies claiming a handoff wait for that handoff to finish. Run `node scripts/check-streaming.mjs` and `node scripts/check-walkthrough.mjs` to verify cadence, sending/receipt boundaries and existing timeline invariants.

The same named Incident response skill is now visible in both worker perspectives: Verify recovery for Omar, Customer update for Noura. Its inspectable example file follows the Agent Skills format at `public/demo/skills/incident-response/SKILL.md`. This is a presentation fixture; skill execution is not implemented. Shared context and skills direction is recorded in `../../docs/plans/2026-09-24-shared-context-and-skills.md`.

The activity timeline covers reading sources, sharing context, receiving it, collaborating, review, verification and completion. Shared-context detail is limited to exchanges involving the current worker.

## Hero framing revision

The preview is bounded to 1320px with a maximum 680px product stage. Default presentation hides the development caption, chapters, and scrubber. Chat text is larger, the right preview is narrower, and the relevant pull request is visible near the top of the engineering preview. On narrow screens, context and skill summaries remain visible above the conversation; source previews open on demand.

Verified the 40-second continuous desktop playback, normal streaming paragraph layout, visible skill and handoff panel, both worker perspectives, final result, and shared-skill dialog. Checked 390 CSS pixels with zero horizontal overflow; the real composer grew from 41px to 82px for a longer message. Build and timeline/streaming checks pass. Upstream lint warnings and the existing build chunk-size warning remain.

## Hero atmosphere preview

Open `http://127.0.0.1:4320/?hero=1` for the full-width silver/charcoal background behind a provisional headline and the approved product component. Paper's actual MeshGradient component is reused with its Ink preset adapted to the palette. The headline is layout copy, not a settled messaging decision. Use `?hero=1&background=off` to compare the same composition on plain black. The shader and co-authored headline loop independently of the product player. Hidden/offscreen rendering is paused and reduced motion stays static. The shader is lazy-loaded and capped near 650k pixels.


## Phone feature section

Open `http://127.0.0.1:4320/?hero=1#features` or use the Features link in the hero navigation. Three tabs reuse one real iPhone frame: Shared context, Shared skills and Agent coordination. Each plays a 16-second fictional scene with synced context panels. On mobile the panels stack beneath the phone. Pause and replay controls are below the panels. Playback pauses offscreen and when the tab is hidden; reduced motion displays the completed scene.

Checkpoint example: `?hero=1&t=40&feature=skills&ft=16#features`. `t` remains the product walkthrough clock; `ft` is the feature clock. The ambient hero uses its own continuous clock. Source: `src/FeatureShowcase.tsx`, `src/FeatureShowcase.css`, `src/feature-stories.ts`. Run `node scripts/check-feature-stories.mjs` for readable turn timing and approval ordering.

### Landing-page sections

The hero landing page now includes four additional interactive sections:
- `?hero=1#connections`: three cross-app examples using real existing app icons.
- `?hero=1#learning`: correction → published shared skill → reuse in another person's workspace.
- `?hero=1#cloud`: scheduled task → overnight progress → morning brief with a review decision.
- `?hero=1#architecture`: selectable Workspace, Coordination, Harness and Runtime layers.

Connector and learning stories advance once while visible. The cloud desktop scene loops through checking the release, reading results and preparing the brief. All pause offscreen/in background and have chapter/pause/replay controls. Reduced motion presents the final state. `&proof=0`, `&proof=1`, or `&proof=2` starts all section stories paused at that chapter for review. These fixtures describe planned product behavior, not a working backend.

## Continuous hero and closing CTA

The headline loops every 30 seconds, retaining the existing edit timing and 18 characters/second typing. The copy says “your team’s agents.” Paper’s backdrop retains speed 0.12 and continues after the product walkthrough ends. Both respect reduced motion and page visibility.

The cloud story now pairs progress copy with an animated desktop/browser view; it replaces the earlier status-only bar. The closing section at `?hero=1#join` reuses Acewallet’s actual Apple Watch GLB and local Three.js runtime, with charcoal materials, refined studio lighting and a work-approval screen. It loads near the viewport and pauses offscreen. Its 16-second approval story shows a decision arriving, an approval press, the agent resuming and a completion receipt. The screen and accessible approval control trigger the sequence; pause and replay are available. Asset attribution is in `public/watch/ATTRIBUTION.md`. No watchOS app or backend is implied.

The closing CTA is prepared for a waitlist destination. `WAITLIST_URL` in `src/ClosingCta.tsx` remains null until the user supplies the actual URL; the button is disabled rather than linking to an invented endpoint.

Watch review checkpoint: `?hero=1&watchAt=11#join` freezes the completion frame; omit `watchAt` for normal playback.

## Published landing page and signup

The root route now opens the full landing page; `?hero=0` opens the isolated desktop prototype. The watch CTA has been replaced with an email waitlist. `POST /api/waitlist` validates and saves addresses in a private D1 table; duplicate entries are idempotent. No automated email is sent by this endpoint. The coordination feature explicitly explains Human → agent → agent → human.

Hosting uses the registered Sites project in `.openai/hosting.json`. Build with `npm run build` then `node scripts/build-hosting.mjs` to arrange the frontend in `dist/client` and API Worker in `dist/server`. Watch and logo-option experiments are excluded from the published assets. Database schema is in `db/schema.ts`; append migrations with `npx drizzle-kit generate` before publishing. Run `node scripts/check-waitlist.mjs` for API/storage checks. Read/export signups using the private Sites database tools; there is intentionally no public list endpoint.

The email signup supports ⌘K on Mac / Ctrl+K elsewhere, outside editable fields. The shortcut scrolls to and focuses the signup. Its hint is hidden on touch devices.
