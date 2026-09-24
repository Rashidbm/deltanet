# Source and component ledger

Updated September 24, 2026. This is a local frontend prototype with fictional content. No live app access, model invocation, external message, deployment or permission change occurs. No generated images, custom-drawn brand assets or invented logo marks.

## Directly reused components

| Source | Reused code | Adaptation |
| --- | --- | --- |
| [Vercel AI Elements](https://elements.ai-sdk.dev/examples/chatbot) | Conversation, Message, MessageContent, PromptInput and compound components | Product copy, neutral theme and composition. The actual textarea handles wrapping and submit. |
| [Official ChatGPT example](https://elements.ai-sdk.dev/api/registry/example-demo-chatgpt.json) | Reference for rounded user bubbles, unboxed assistant replies and bottom composer | Read the source and reused its underlying components. Not proprietary ChatGPT source or an exact clone. |
| [shadcn/ui](https://ui.shadcn.com/docs/components/sidebar) | Sidebar, Avatar, Collapsible, Dialog, Input, Badge, Button, Tooltip | Installed Radix/new-york source; product-specific sizing and spacing in App.css. |
| [Lucide](https://lucide.dev/) | Standard interface icons | Imported icons, no hand-drawn paths. |
| [Geist](https://vercel.com/font) | Typeface via @fontsource-variable/geist | Installed through shadcn initialization. |

AI Elements registry URLs: `https://elements.ai-sdk.dev/api/registry/{conversation,message,prompt-input}.json`. `message-layout.tsx` contains unchanged Message/MessageContent layout exports extracted from message.tsx, avoiding unused Markdown/diagram bundles. PromptInputActionMenuTrigger uses Radix `asChild` after the installer initially converted it to Base UI's `render` API. Unused registry components may remain in the prototype but are not rendered.

Licenses retained under licenses/: AI Elements Apache-2.0, shadcn/ui MIT, Lucide ISC. Upstream repositories: https://github.com/vercel/ai-elements, https://github.com/shadcn-ui/ui, https://github.com/lucide-icons/lucide.

## Reference-based composition

**Dock:** https://trydock.ai/. Direct browser inspection of populated chat, handoff disclosure and document stage. Adapted short back-and-forth, a follow-up affecting subsequent work, named agent messages, compact expandable details, and linked work. No Dock source or branded portraits copied. DeltaNet's per-person private-agent model is our concept, not a claimed Dock feature.

**Linear:** the right panel replaces the previous invented Recovery plan / Patch / Customers hybrid. It is a source-based recreation of issue anatomy, adapted to a side preview, not a real embedded Linear application or an exact screenshot. Verified references:

- [Assignment and delegation](https://linear.app/docs/assigning-issues): Diffs, Properties, one human assignee, indented agent delegate, Labels. [Official screenshot](https://webassets.linear.app/images/ornj730p/production/a9981795b1c0e68807294bef731fd782d1ead7ac-1676x1148.png).
- [Editing issues](https://linear.app/docs/editing-issues): compact breadcrumb, title, prose description. [Official screenshot](https://webassets.linear.app/images/ornj730p/production/d8f7b8a4591344aa7946960fc408d1fa05044b4c-1256x402.png).
- [Comments and reactions](https://linear.app/docs/comment-on-issues): Activity, event rows, author/time, comments and comment composer. [Official screenshot](https://webassets.linear.app/images/ornj730p/production/ec0d3a41ec497dbb27653e26110d8a3cac29b964-1203x796.png).
- [GitHub integration](https://linear.app/integrations/github): linked pull requests. A prepared or approved PR does not imply deployed or recovered software.

The source-bar wrapper, preview expansion, references dialog, connector directory and private conversation are DeltaNet composition using existing components. Runbook, email and PR detail dialogs are explicitly source previews, not imitations of full Google Docs, Gmail or GitHub applications. Issue checklist text is authored demo content, not a proprietary Linear feature. No fake code diff or invented recovery statistic is presented.

## Real existing assets

Seven SVG logos copied from `/Users/rashid/nucleus/web/lib/opal/src/logos/`: google-drive, slack, github, linear, gmail, hubspot, notion. SVG paths are unchanged. Converted JSX size/attribute syntax to standalone SVG; replaced GitHub class fill with #24292F, and Notion external CSS variables with white/near-black. GitHub is inverted through CSS on dark backgrounds. All brand marks belong to their owners.

## Scenario and capability boundaries

ENG-241, PR #482, the release, incident messages, 23 affected accounts, runbook and email are fictional. [Incident.io's investigation workflow](https://incident.io/blog/introducing-ai-sre) supports the general investigation/patch workflow, not DeltaNet's implemented capability. The additional customer coordination is our scenario.

Drive supplies a named runbook and procedure, never live telemetry or proof of recovery. [Drive file search documentation](https://developers.google.com/workspace/drive/api/guides/search-files). Notion appears in the connector directory but is not credited as a source used for this task.

The Linear issue has Omar as the single human assignee and Omar's agent as delegate. Noura's agent handles customer work separately. Private chats are not displayed across users; only shared task messages appear in the handoff. These are intended product semantics, not implemented backend security guarantees.

Detailed research: ../../docs/research/hero-work-surface-references.md.

### Timed hero walkthrough
- [Linear Asks](https://linear.app/changelog/2026-05-21-project-slack-channels): visually verified request → clarification → short answer → linked result. Dialogue is original fictional incident content, following that structure.
- [Dock](https://trydock.ai/): visually verified typed composer, compact follow-ups, subordinate handoff disclosure and work beside chat.
- [0xDesigner](https://x.com/0xDesigner/status/2070957137027871193): scoped coordination receipts; no claim that a desktop person switch was observed.
- [Motion AnimatePresence](https://motion.dev/docs/react-animate-presence): installed `motion` from npm, used directly for expanding conversation panels. MIT license in `licenses/motion-LICENSE.md`.
- Perspective labels, chapter controls and cuts are outside the app frame. They are marketing playback controls, not a product capability to inspect coworkers' private conversations.
- Full evidence and limitations: `../../docs/research/hero-dialogue-motion-references.md`.

Transition revision: measured Dock `.as-col` flex-grow timing (850 ms, cubic-bezier(.16,1,.3,1)) and content opacity timing (500 ms, 150 ms delay). Sidebar remains mounted; the full-screen crossfade was removed.

### Shared context and skill presentation

[Agent Skills specification](https://agentskills.io/specification): the example `public/demo/skills/incident-response/SKILL.md` uses the documented directory, YAML name/description, optional version metadata, and Markdown instruction body. The same procedure appears in Omar’s and Noura’s views with different active steps. It is fictional demo content, not a live installed skill or evidence of backend execution. The context panel and compact skill disclosure are DeltaNet composition using the existing component library; they are not represented as proprietary Dock or Linear UI.

### Hero background study

[Paper Mesh Gradient](https://shaders.paper.design/mesh-gradient), directly reused from `@paper-design/shaders-react` 0.0.81. Browser-inspected Ink preset supplies distortion=1, swirl=.2 and rotation=90. Adaptations: charcoal/silver palette, .12 speed, slight grain, CSS masks for headline readability, pixel cap, viewport/tab visibility pause and reduced-motion still frame. Apache-2.0 license and NOTICE retained under `licenses/paper-shaders-*`. No raster imagery or custom shader generated. The headline in `?hero=1` is provisional composition copy.

### Triangular logo shortlist

`public/logo-options/index.html` compares two existing Logoipsum vectors read from the rendered official catalogue: #365 (editor logo=82) and #429 (editor logo=128). Path geometry and original fills are retained; preview CSS displays both in white. Source pages: https://logoipsum.com/editor?logo=82 and https://logoipsum.com/editor?logo=128 . License: https://logoipsum.com/license . The source explicitly restricts unaltered marks to placeholder use and prohibits claiming ownership or registering them as trademarks. The user selected option 01 (#365, Split delta) as a temporary placeholder. It is applied in the navigation beside the DeltaNet wordmark in white via CSS; this is not a settled final identity.


### Header, headline and collaborative carets

- Header hierarchy follows the user-supplied Linear navbar screenshot: brand left, restrained navigation right, light pill action. Adapted to working prototype actions (Product, Connections, Shared skills, Watch demo).
- Pitch research: [Dock original Launch YC post](https://www.ycombinator.com/launches/Th4-dock-a-multiplayer-agent-workspace-that-gives-you-a-team-of-proactive-agents-that-feel-like-colleagues-instead-of-chat-boxes). Its core problem is people relaying context between isolated agents. DeltaNet's original headline applies that insight to private personal agents cooperating across a human team: “Your team works together. Now your AI does too.” No department-replacement or productivity-multiplier claims adopted.
- [Dock homepage](https://trydock.ai/) inspected directly in the browser: named editing carets, selection tint, .55s cubic-bezier(.65,0,.25,1) caret movement and .5s cubic-bezier(.4,0,.6,1) vertical text reveal. Reimplemented with existing Motion primitives, original copy, Omar/Noura initials and muted violet/green. No proprietary avatars or generated assets. Noura's label sits below the second line to avoid overlap.
- Headline phases use the existing walkthrough clock: primary → context → skills → primary. Settles on the primary message at the end; reduced motion keeps it static. Navigation dialogs reuse existing shadcn components.
- Verified at 1280px and 390px: no horizontal overflow, legible caret labels, working Connections dialog and Watch demo action. Build, lint (existing upstream warnings only), timeline and streaming checks passed.


### Co-authoring revision — user-selected pain-led headline

The user preferred the middleman positioning and asked for shared-document editing like Dock/Word/Excel. The hero now keeps “Stop being the middleman.” fixed. Omar and Noura co-edit phrases within “Let your agents work together.” using named insertion carets, colored selections and actual character replacement. Edits introduce “your AI team,” “share context,” and “share skills,” then settle on the opening line. This supersedes the earlier whole-headline carousel.

The original Dock reference supplies the named-caret and selection language; the coordinated phrase-edit sequence is a DeltaNet adaptation. Each caret is anchored to the actual text endpoint rather than an arbitrary offset. Selection lasts .65s; replacement types at 18 characters/second with overlapping editor presence. Reduced motion keeps the complete initial copy with no animated carets. The walkthrough clock controls replay, pause and seeking. No new external assets.

Browser checked the resting headline, overlapping edit state and 390px layout. Normal autoplay verified after replacing the previous animation. Build and existing timeline/streaming checks pass; lint has only pre-existing library warnings.


### Monochrome presence refinement

Per user feedback, the co-authoring UI now stays within the charcoal/silver identity: 1px silver insertion carets, subtle neutral selection shading and small graphite name labels. Names identify collaborators; editor-specific violet/green colors have been removed. The edit sequence is unchanged. Visually checked the overlapping edit state in the browser; build passes.


### Phone feature showcase

The approved section beneath the hero uses one fixed phone with selectable Shared context, Shared skills and Agent coordination scenes. Composition follows the user's Dock screenshot and the existing phone prototype. The scene copy and task-sharing states are fictional DeltaNet demonstrations, not native iOS functionality or connected backend behavior.

Reused unchanged assets: `public/device/iphone-15-black.png` and `public/device/icons/*.png` copied from the original `../agent-handoff/assets/`. The PNG source is https://mockuphone.com/images/mockup_templates/apple-iphone-15-black-portrait.png ; the device page credits Apple Design Resources. See https://mockuphone.com/model/iphone-15/ and https://mockuphone.com/attribution/ . The exported SF Symbols and full provenance are recorded in `../agent-handoff/SOURCES.md`. Existing Nucleus app SVGs are reused from `public/apps/`.

Reused components: installed shadcn/Radix Tabs and Button; installed Motion for message/panel entrance. Mobile chrome and screen/frame placement reuse the original phone study. The panels use ordinary CSS translucency/backdrop blur, not a claim to implement Apple's native Liquid Glass. Material guidance: https://developer.apple.com/design/human-interface-guidelines/materials . Their anatomy reuses the existing task-context source list, shared skill steps, and agent decision receipts.

Three 16-second scenes play once, start when the section is visible, pause when offscreen/hidden, and offer pause/replay. Tab selection resets the scene. Reduced motion shows complete sample data. `?feature=context|skills|coordination&ft=16#features` opens a paused checkpoint. Keyboard tabs follow the displayed orientation. No generated assets or new dependencies.

## Connected work, shared learning, cloud runtime, and architecture (2026-09-24)

These sections are custom DeltaNet compositions using existing Radix/shadcn Tabs and Buttons, Motion, Lucide icons, Geist, the previously sourced app SVGs, and the existing temporary split-delta mark. No new raster assets, AI-generated imagery, or third-party illustrations were produced or copied.

- Shared memory and learning reference: https://github.com/garrytan/gbrain — sourced facts, corrections, persistence and optional background consolidation. No benchmark or universal learning claim copied.
- Shared procedure reference: https://github.com/garrytan/gbrain/blob/master/docs/guides/shared-brain-skills.md — authorized published skill revisions. The fictional Omar → shared release skill → Rashid story demonstrates the proposed DeltaNet experience.
- Harness/runtime reference: https://trydock.ai/blog/what-a-dock-agent-is-made-of — separation of workspace, agent loop, execution and durable knowledge. DeltaNet cloud behavior is a proposed feature, not inferred from Dock or Nucleus.
- Architectural visual reference: user-supplied Linear Fig 0.1/0.2 screenshot, https://linear.app/. Thin isometric surfaces and monochrome geometry informed our own SVG diagram. The diagram has DeltaNet's four conceptual layers, shared memory/skills spine, and model/tool connections; no Linear asset or logo is used.
- Connector examples show excerpts in DeltaNet source cards, not invented replicas of third-party native applications. Original brand marks remain their real colors; decorative surfaces remain monochrome.

Nucleus is only a source of reusable components. DeltaNet's coordination, harness, shared learning and runtime are its own planned system. All new workflows are local sample data and do not execute jobs, access connected accounts, publish skills to real teammates or send messages.

## Continuous atmosphere and reused watch CTA (2026-09-24)

This revision supersedes the earlier player-linked headline and backdrop behavior. Their independent continuous clocks preserve the shader speed, selection duration and typing speed. “Your team’s agents” replaces “your AI team” to make the human-team relationship explicit. The cloud narrative retains its existing beat durations in a compact looping bar.

The closing CTA reuses `/Users/rashid/acewallet/assets/watch.glb` and its Three.js r160 runtime. Embedded model metadata identifies “Apple Watch Ultra - Orange” by alboxer2000_, CC BY 4.0: https://sketchfab.com/3d-models/apple-watch-ultra-orange-4656191de2e94767a8c16003fca1f268 . Original geometry/file unchanged; materials are adapted to charcoal and the screen is a coded DeltaNet work brief. Full attribution, adaptation notes and runtime licensing are available from the visible credits link in `public/watch/ATTRIBUTION.md`. No image generation was used.

Notification anatomy references Apple’s documentation: https://developer.apple.com/documentation/watchos-apps/presenting-notifications-on-apple-watch and https://developer.apple.com/documentation/watchos-apps/adding-actions-to-notifications-on-watchos . Rendering uses https://threejs.org/docs/pages/CanvasTexture.html and https://threejs.org/docs/pages/GLTFLoader.html . The scene adapts Acewallet’s existing camera/display mesh and replaces its payment interaction with a local sample brief.

## Cloud desktop revision (2026-09-24)

The user's Dock screenshot demonstrates a desktop window carrying out work. This replaces the text-only cloud strip with a compact split composition: task progress on the left, an animated desktop/browser view on the right. The charcoal surfaces, monochrome agent cursor and existing DeltaNet typography remain.

The GitHub job-log anatomy is adapted from the official screenshot and documentation at https://docs.github.com/en/actions/how-tos/monitor-workflows/use-workflow-run-logs and https://docs.github.com/assets/cb-33371/images/help/repository/copy-link-button-updated-2.png (viewed directly). Job title, status, expandable steps, durations and numbered output follow that reference. The checkout job names, results and brief are fictional sample data; the second tab uses DeltaNet's own document styling. No GitHub application connection or actual overnight run is implied. Browser chrome follows the supplied desktop reference, with inactive monochrome macOS-style window controls.

Existing app SVGs, Lucide icons, Motion, and the section playback hook are reused. The three original durations remain 4 / 4.5 / 5 seconds, with visible check output and a tab transition into the morning brief. No generated assets, downloaded wallpaper or new package dependency.

## General capabilities, headline edit and watch approval (2026-09-24)

Connector tabs now describe Gather context, Share context and Take action. Concrete project examples illustrate these capabilities without presenting departments or use cases as product limits. The headline adds a brief named-caret edit from “middleman” to “bottleneck” and back during the existing 30-second cycle.

The watch reuses the same attributed Acewallet model and references `/Users/rashid/acewallet/assets/watch-pay.js`: its named beats, deliberate front-facing pose, brief press response, completion hold and softbox environment. Payment/NFC geometry is not relevant to DeltaNet and is not carried over. A work decision arrives, the approval button depresses, the agent resumes and a completion receipt appears. Screen taps and a keyboard-accessible approval button trigger the same illustrative sequence. Pause/replay, visibility pausing and reduced motion are retained.

The screen is rendered at 2048px with anisotropic filtering; studio softbox reflections, reduced normal-map strength and charcoal strap materials improve clarity. Notification action structure follows Apple's existing reference: https://developer.apple.com/documentation/watchos-apps/adding-actions-to-notifications-on-watchos . All messages, approvals and sends are local demo states. No external action occurs.
