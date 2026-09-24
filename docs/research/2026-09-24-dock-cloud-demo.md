# Dock computer-use demo: direct inspection

Reference: https://trydock.ai/#compute
Inspected September 24, 2026 using the live page, screenshots, rendered DOM and computed styles. Scope: the Computer & Storage section, not the hero.

## What was observed

- The right-hand scene cycles through constructed HTML application views: Google-style search results, an Apollo people-search view, a spreadsheet, and a Figma-style editor. They are demo surfaces rendered as DOM elements, not embedded live application sessions.
- The desktop uses a wallpaper asset, an inset application window, a soft shadow, compact title-bar controls and app-specific chrome. Browser tabs/address bar are used for browser scenes; the Figma scene has editor panels and a toolbar instead.
- Spreadsheet content includes row/column headers, multiple populated rows and one selected cell. Its staggered row entrances are 450 ms with roughly 260 ms between rows. This provides several small events after the scene appears.
- Figma has the layers panel, tools, inspector fields, multiple artboards and a selected artwork with corner handles. Two labeled cursors appear over task-relevant regions.
- Observed computed scene entrance: 500 ms, cubic-bezier(.16,1,.3,1). Cursor entrance/drift: 2.6 seconds with staggered delays. A moving pointer alone is not evidence that a real app operation happened.
- The app display is approximately 465 px wide inside a roughly 538 px desktop card at a 1280 px browser viewport. This scale makes the UI feel like a whole working environment rather than an oversized text card.
- Actual interactions tested: Cloud/Local switches change the caption, theme and task description. Clicking the overnight summary expands seven action rows; clicking a Gmail action expands its result. The rendered browser scene inspected contained no functioning button/input controls.
- The overnight activity list and the visible app scene are distinct demonstrations. Do not describe the site as a live remote desktop or assume their actions are causally synchronized.

## Comparison with DeltaNet's current implementation

| Current DeltaNet | Proposed revision | Reason |
| --- | --- | --- |
| Generic browser frame around a mostly finished brief | Recognizable app views with authentic title bars, navigation and toolbars | Familiar structure creates credibility |
| One pointer moves between three positions | Small cursor movements timed to a selection, edit or visible result | Motion should explain an action |
| Whole log or brief appears with a step change | Stage the operation: select, open, edit, save, then hold | Show how the result is produced |
| Most controls are decorative | Selectable app tabs, expandable task history, pause/replay | Let visitors inspect the scene |
| Large brief typography and empty areas | Denser, legible application layout within a desktop frame | Match software proportions |
| One repeated release scenario | A broader work sequence that crosses apps | Demonstrate the cloud capability without limiting the product to incidents |

## Recommended next design (proposal, not implemented)

Keep the charcoal/silver outer section. Reuse real application marks and source the app layouts from their actual interfaces. Use one coherent workflow with a browser research step, a spreadsheet update and an email draft. Two people's agents pass context between these steps, preserving the human-team positioning. A final review state belongs to a person.

The desktop should remain the same size through scene changes. Give each action a visible target and response; use a short fade to switch apps and preserve reading time. App tabs and a compact expandable activity record should be usable by mouse and keyboard. Selecting a view should pause auto-play until the visitor resumes it. Reduced motion should show a readable completed state with all views still selectable.

Do not reuse Dock's branded art, crew avatars or copy. Do not add an unsupported Local mode just because Dock has one. Do not equate animation with real production execution; retain the illustrative-demo label.

## Implementation references and assets

The replacement keeps recognizable app-specific UI: Chrome on macOS, Google search, Google Sheets, Gmail. The data is fictional and labeled as illustrative.

- Sheets menu / toolbar / cell selection / sharing: https://support.google.com/a/users/answer/9300022?hl=en
- Gmail compose fields, attachment area and send controls: https://support.google.com/a/users/answer/9259846?hl=en
- Current Sheets brand mark: https://workspace.google.com/intl/en/products/sheets/ (official wordmark is cropped via CSS to its icon; file unchanged).
- Google wordmark: official Google Workspace footer SVG.
- Existing Gmail icon and Apple SF Symbols retained from the project's sourced assets.

The desktop is an interactive illustration, not an embedded authenticated session. Clicking tabs pauses automatic progression; source results reveal the selected vendor evidence; spreadsheet cells show their value in the formula bar; activity expands into individual handoff records; email remains a draft for human review.
